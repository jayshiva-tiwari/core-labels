import React from 'react';
import { LabelField, LabelSize, LabelTemplate, LabelStyle } from '../types';
import { FieldContent } from './FieldContent';

interface LabelMockupProps {
  printRotated?: boolean;
  fields: LabelField[];
  size: LabelSize;
  template: LabelTemplate;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export function LabelMockup({ printRotated, fields, size, template, selectedFieldId, onSelectField }: LabelMockupProps) {
  // Dimensions based on size selection
  const sizeClasses = {
    '4x4': 'w-[400px] h-[400px]',
    '2x2': 'w-[250px] h-[250px]',
    '4x6': 'w-[400px] h-[600px]',
    '4x2': 'w-[400px] h-[200px]',
  };

  const getTextStyleObj = (styles?: LabelStyle) => {
    if (!styles) return {};
    const obj: React.CSSProperties = {};
    if (styles.fontFamily) obj.fontFamily = styles.fontFamily;
    if (styles.fontSize) obj.fontSize = `${styles.fontSize}px`;
    if (styles.color) obj.color = styles.color;
    if (styles.bold) obj.fontWeight = 'bold';
    return obj;
  };


  const [pageW, pageH] = size.split('x');
    const printStyle = `
    @media print {
      @page {
        size: ${printRotated ? `${pageH}in ${pageW}in` : `${pageW}in ${pageH}in`};
        margin: 0;
      }
      #print-label {
        ${printRotated ? `
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) rotate(90deg) !important;
          margin: 0 !important;
        ` : `
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          margin: 0 !important;
        `}
      }
    }
  `;

  const getStyleObj = (styles?: LabelStyle, defaultAlign?: 'left'|'center'|'right'|'justify') => {
    const obj: React.CSSProperties = {
      textAlign: styles?.textAlign || defaultAlign,
    };
    if (!styles) return obj;

    if (styles.fontFamily) obj.fontFamily = styles.fontFamily;
    if (styles.fontSize) obj.fontSize = `${styles.fontSize}px`;
    if (styles.color) obj.color = styles.color;
    
    if (styles.borderWidth !== undefined && styles.borderWidth > 0) {
      obj.borderTopWidth = `${styles.borderWidth}px`;
      obj.borderRightWidth = `${styles.borderWidth}px`;
      obj.borderBottomWidth = `${styles.borderWidth}px`;
      obj.borderLeftWidth = `${styles.borderWidth}px`;
      obj.borderColor = '#000';
      obj.borderStyle = 'solid';
    }
    if (styles.borderRadius !== undefined && styles.borderRadius > 0) {
      obj.borderRadius = `${styles.borderRadius}px`;
    }
    return obj;
  };

  const config = {
    '4x4': {
      pad: 'p-8', title: 'text-3xl', sku: 'text-sm', roll: 'text-xs px-2 py-1',
      gap1: 'pb-4 mb-4 border-b-2', barcodePy: 'py-6', barcodeH: 'h-24', sysId: 'text-sm tracking-[0.3em] mt-3',
      gap2: 'pt-4 mt-4', footerLabel: 'text-[10px]', footerVal: 'text-base', qcSize: 'w-12 h-12 text-lg border-2',
      tabBorder: '2px', tabTitle: 'text-2xl leading-tight', tabText: 'text-xl leading-tight'
    },
    '4x2': {
      pad: 'p-4', title: 'text-xl', sku: 'text-xs', roll: 'text-[10px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]', barcodePy: 'py-2', barcodeH: 'h-10', sysId: 'text-[10px] tracking-[0.2em] mt-1.5',
      gap2: 'pt-2 mt-2', footerLabel: 'text-[8px]', footerVal: 'text-sm', qcSize: 'w-8 h-8 text-xs border-[1.5px]',
      tabBorder: '1px', tabTitle: 'text-lg leading-tight', tabText: 'text-sm leading-tight'
    },
    '2x2': {
      pad: 'p-4', title: 'text-lg', sku: 'text-[10px]', roll: 'text-[8px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]', barcodePy: 'py-2', barcodeH: 'h-12', sysId: 'text-[9px] tracking-[0.2em] mt-2',
      gap2: 'pt-2 mt-2', footerLabel: 'text-[8px]', footerVal: 'text-xs', qcSize: 'w-8 h-8 text-xs border-[1.5px]',
      tabBorder: '1px', tabTitle: 'text-sm leading-tight', tabText: 'text-xs leading-tight'
    },
    '4x6': {
      pad: 'p-8', title: 'text-4xl', sku: 'text-base', roll: 'text-sm px-2 py-1',
      gap1: 'pb-6 mb-6 border-b-2', barcodePy: 'py-8', barcodeH: 'h-32', sysId: 'text-base tracking-[0.3em] mt-4',
      gap2: 'pt-6 mt-6', footerLabel: 'text-[12px]', footerVal: 'text-xl', qcSize: 'w-16 h-16 text-xl border-2',
      tabBorder: '2px', tabTitle: 'text-4xl leading-tight', tabText: 'text-2xl leading-tight'
    }
  };

  const c = config[size];
  
  // Physical print dimensions
  const printDims: Record<LabelSize, {width: string, height: string}> = {
    '4x4': { width: '4in', height: '4in' },
    '2x2': { width: '2in', height: '2in' },
    '4x6': { width: '4in', height: '6in' },
    '4x2': { width: '4in', height: '2in' },
  };

  const InteractiveBlock: React.FC<{ field?: LabelField; defaultClasses: string; children: React.ReactNode }> = ({ field, defaultClasses, children }) => {
    if (!field) return <div className={defaultClasses}>{children}</div>;
    const isSelected = selectedFieldId === field.id;
    
    const textStyle = getTextStyleObj(field.styles);
    const styledChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // @ts-ignore
          style: { ...(child.props.style || {}), ...textStyle }
        });
      }
      return child;
    });

    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
        className={`${defaultClasses} cursor-pointer transition-colors outline-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : 'hover:bg-gray-50/50 rounded'}`}
        style={getStyleObj(field.styles, 'left')}
      >
        {styledChildren}
      </div>
    );
  };

  if (template === 'blank') {
    return (
      <>
      <style>{printStyle}</style>
      <div 
        className={`bg-white shadow-2xl rounded-sm p-8 flex flex-col relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden`}
        style={printDims[size]}
        id="print-label"
        onClick={() => onSelectField('')}
      >
        <div className="flex-1 w-full flex flex-col gap-3 relative z-10">
          {fields.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
               <span className="text-2xl font-medium tracking-wide">Blank Canvas</span>
             </div>
          ) : (
            fields.map(f => (
              <InteractiveBlock key={f.id} field={f} defaultClasses="w-full">
                <FieldContent field={f} className="block w-full" style={getTextStyleObj(f.styles)} />
              </InteractiveBlock>
            ))
          )}
        </div>
      </div>
      </>
    );
  }

  if (template === 'tabular' || template === 'roll-data') {
    return (
      <>
      <style>{printStyle}</style>
      <div 
        className={`bg-white flex flex-col relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden border-black shadow-2xl rounded-sm`}
        style={{ borderWidth: c.tabBorder, ...printDims[size] }}
        id="print-label"
        onClick={() => onSelectField('')} // deselect
      >
         <div className="flex-1 flex flex-col min-h-0">
           {fields.map((f, i) => {
             const isFullWidth = f.styles?.fullWidth;
             const isSelected = selectedFieldId === f.id;
             
             return (
               <div 
                 key={f.id} 
                 className={`flex ${f.styles?.rowHeight ? 'shrink-0' : 'flex-[1_0_auto]'} border-black cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                 style={{ 
                   borderBottomWidth: i !== fields.length - 1 ? c.tabBorder : 0,
                   height: f.styles?.rowHeight ? `${f.styles.rowHeight}px` : undefined
                 }}
                 onClick={(e) => { e.stopPropagation(); onSelectField(f.id); }}
               >
                 {isFullWidth ? (
                   <div 
                     className="w-full flex items-center p-2 "
                     style={getStyleObj(f.styles, 'center')}
                   >
                     <FieldContent field={f} className={`${c.tabTitle} font-normal break-words whitespace-pre-wrap`} style={getTextStyleObj(f.styles)} />
                   </div>
                 ) : (
                   <>
                     <div 
                       className="flex items-center p-2  border-black shrink-0" style={{ width: `${f.styles?.columnWidth || 50}%`, borderRightWidth: c.tabBorder, ...getStyleObj(f.styles, 'center') }}
                       
                     >
                       <span className={`${c.tabText} font-normal break-words whitespace-pre-wrap block w-full`} style={getTextStyleObj(f.styles)} title={f.label}>{f.label}</span>
                     </div>
                     {f.styles?.showColon ? (
                        <div className={`${f.styles?.rightColumnWidth ? 'flex-1' : 'shrink-0'} flex items-center justify-center border-black`} style={{ width: f.styles?.rightColumnWidth ? undefined : `${f.styles?.colonWidth || 10}%`, borderRightWidth: c.tabBorder }}>
                          <span className={`${c.tabText} font-bold leading-none`}>:</span>
                        </div>
                     ) : (
                        f.styles?.rightColumnWidth && <div className="flex-1" />
                     )}
                     <div className={`${f.styles?.rightColumnWidth ? 'shrink-0' : 'flex-1'} min-w-0 flex items-center p-2 `} style={{ width: f.styles?.rightColumnWidth ? `${f.styles.rightColumnWidth}%` : undefined, borderLeftWidth: f.styles?.rightColumnWidth && !f.styles?.showColon ? c.tabBorder : 0, ...getStyleObj(f.styles, 'center') }}>
                       <FieldContent field={f} className={`${c.tabText} font-normal break-words whitespace-pre-wrap`} style={getTextStyleObj(f.styles)} />
                     </div>
                   </>
                 )}
               </div>
             );
           })}
         </div>
      </div>
      </>
    );
  }

  // Standard Template
  const findField = (labelQuery: string) => fields.find(f => f.label.toLowerCase().includes(labelQuery.toLowerCase()));
  
  const sysField = findField('system id');
  const rollField = findField('roll number');
  const productField = findField('product name');
  const skuField = findField('sku');
  const batchField = findField('batch number');

  // Handle freeform blocks (extra fields added by user)
  const knownIds = [sysField, rollField, productField, skuField, batchField].filter(Boolean).map(f => f!.id);
  const extraFields = fields.filter(f => !knownIds.includes(f.id));



  return (
    <>
    <style>{printStyle}</style>
    <div 
      className={`bg-white shadow-2xl rounded-sm ${c.pad} flex flex-col border border-gray-300 relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden `}
      style={printDims[size]}
      id="print-label"
      onClick={() => onSelectField('')} // deselect
    >
      {/* Header area */}
      <div className={`flex justify-between items-start border-black shrink-0 ${c.gap1}`}>
        <div className="flex-1 min-w-0 mr-3 space-y-1">
          <InteractiveBlock field={productField} defaultClasses="w-full">
            <h1 className={`${c.title} font-black uppercase tracking-tighter leading-none break-words whitespace-pre-wrap block w-full`} title={productField?.value || 'PRODUCT NAME'}>
              {productField?.value || 'PRODUCT NAME'}
            </h1>
          </InteractiveBlock>
          <InteractiveBlock field={skuField} defaultClasses="w-full">
            <p className={`${c.sku} font-medium text-gray-600 uppercase break-words whitespace-pre-wrap block w-full`} title={skuField?.value || 'XXXXX'}>
              SKU: {skuField?.value || 'XXXXX'}
            </p>
          </InteractiveBlock>
        </div>
        <div className="text-right shrink-0">
          <InteractiveBlock field={rollField} defaultClasses="inline-block min-w-[80px]">
            <span className={`${c.roll} font-bold bg-black text-white uppercase tracking-widest whitespace-nowrap block w-full text-center`}>
              {rollField?.value || 'RL-00'}
            </span>
          </InteractiveBlock>
        </div>
      </div>

      {/* Dynamic Content (Extra Fields) */}
      {extraFields.length > 0 && (
        <div className="w-full flex-shrink-0 flex flex-col gap-2 py-2">
          {extraFields.map(f => (
            <InteractiveBlock key={f.id} field={f} defaultClasses="w-full">
              <FieldContent field={f} className="font-semibold block w-full" style={getTextStyleObj(f.styles)} />
            </InteractiveBlock>
          ))}
        </div>
      )}

      {/* Barcode Mockup */}
      <div className={`flex-1 flex flex-col items-center justify-center min-h-0 ${c.barcodePy}`}>
         <div className={`flex ${c.barcodeH} w-full max-w-[80%] items-end justify-center gap-[2px] opacity-90`}>
           {Array.from({length: 45}).map((_, i) => (
              <div key={i} className={`h-full bg-black ${i % 7 === 0 ? 'w-1.5' : i % 4 === 0 ? 'w-1' : i % 11 === 0 ? 'w-2' : 'w-[2px]'}`} />
           ))}
         </div>
         <InteractiveBlock field={sysField} defaultClasses="mt-2 w-full max-w-[80%] mx-auto">
           <p className={`${c.sysId} font-mono font-medium text-gray-900 break-words whitespace-pre-wrap block w-full mt-0`}>
             {sysField?.value || 'SYS-000000'}
           </p>
         </InteractiveBlock>
      </div>

      {/* Footer area */}
      <div className={`shrink-0 border-t border-gray-300 flex justify-between items-end ${c.gap2}`}>
        <div className="flex-1 min-w-0 pr-4">
           <InteractiveBlock field={batchField} defaultClasses="w-full">
             <p className={`${c.footerLabel} text-gray-400 uppercase tracking-widest mb-0.5 break-words whitespace-pre-wrap block w-full`}>Batch Number</p>
             <p className={`${c.footerVal} font-semibold break-words whitespace-pre-wrap block w-full`} title={batchField?.value || 'BN-XXXX'}>
               {batchField?.value || 'BN-XXXX'}
             </p>
           </InteractiveBlock>
        </div>
        <div className={`${c.qcSize} border-black rounded-full flex items-center justify-center shrink-0`}>
          <span className="font-bold leading-none mt-0.5">QC</span>
        </div>
      </div>
    </div>
    </>
  );
}
