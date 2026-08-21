import React from 'react';
import { LabelField, LabelSize, LabelTemplate, LabelStyle } from '../types';

interface LabelMockupProps {
  fields: LabelField[];
  size: LabelSize;
  template: LabelTemplate;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export function LabelMockup({ fields, size, template, selectedFieldId, onSelectField }: LabelMockupProps) {
  // Dimensions based on size selection
  const sizeClasses = {
    '4x4': 'w-[400px] h-[400px]',
    '2x2': 'w-[250px] h-[250px]',
    '4x6': 'w-[400px] h-[600px]',
    '4x2': 'w-[400px] h-[200px]',
  };

  const getStyleObj = (styles?: LabelStyle) => {
    if (!styles) return {};
    return {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
      color: styles.color,
      textAlign: styles.textAlign,
      borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
      borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
      borderColor: styles.borderWidth ? '#000' : undefined,
      borderStyle: styles.borderWidth ? 'solid' : undefined,
    } as React.CSSProperties;
  };

  const config = {
    '4x4': {
      pad: 'p-8', title: 'text-3xl', sku: 'text-sm', roll: 'text-xs px-2 py-1',
      gap1: 'pb-4 mb-4 border-b-2', barcodePy: 'py-6', barcodeH: 'h-24', sysId: 'text-sm tracking-[0.3em] mt-3',
      gap2: 'pt-4 mt-4', footerLabel: 'text-[10px]', footerVal: 'text-base', qcSize: 'w-12 h-12 text-lg border-2',
      tabBorder: '6px', tabTitle: 'text-2xl', tabText: 'text-xl'
    },
    '4x2': {
      pad: 'p-4', title: 'text-xl', sku: 'text-xs', roll: 'text-[10px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]', barcodePy: 'py-2', barcodeH: 'h-10', sysId: 'text-[10px] tracking-[0.2em] mt-1.5',
      gap2: 'pt-2 mt-2', footerLabel: 'text-[8px]', footerVal: 'text-sm', qcSize: 'w-8 h-8 text-xs border-[1.5px]',
      tabBorder: '4px', tabTitle: 'text-lg', tabText: 'text-sm'
    },
    '2x2': {
      pad: 'p-4', title: 'text-lg', sku: 'text-[10px]', roll: 'text-[8px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]', barcodePy: 'py-2', barcodeH: 'h-12', sysId: 'text-[9px] tracking-[0.2em] mt-2',
      gap2: 'pt-2 mt-2', footerLabel: 'text-[8px]', footerVal: 'text-xs', qcSize: 'w-8 h-8 text-xs border-[1.5px]',
      tabBorder: '3px', tabTitle: 'text-sm', tabText: 'text-xs'
    },
    '4x6': {
      pad: 'p-8', title: 'text-4xl', sku: 'text-base', roll: 'text-sm px-2 py-1',
      gap1: 'pb-6 mb-6 border-b-2', barcodePy: 'py-8', barcodeH: 'h-32', sysId: 'text-base tracking-[0.3em] mt-4',
      gap2: 'pt-6 mt-6', footerLabel: 'text-[12px]', footerVal: 'text-xl', qcSize: 'w-16 h-16 text-xl border-2',
      tabBorder: '8px', tabTitle: 'text-4xl', tabText: 'text-2xl'
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

  if (template === 'tabular') {
    const titleField = fields[0];
    const gridFields = fields.slice(1);

    return (
      <div 
        className={`bg-white flex flex-col relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden border-black shadow-2xl rounded-sm`}
        style={{ borderWidth: c.tabBorder, ...printDims[size] }}
        id="print-label"
      >
         <div 
           className={`text-center py-2 px-2 flex items-center justify-center shrink-0 border-black cursor-pointer transition-colors ${selectedFieldId === titleField?.id ? 'bg-blue-50/50' : ''}`}
           style={{ borderBottomWidth: c.tabBorder, ...getStyleObj(titleField?.styles) }}
           onClick={() => titleField && onSelectField(titleField.id)}
         >
           <h1 className={`${c.tabTitle} font-normal uppercase truncate max-w-full`} title={titleField?.value}>
             {titleField?.value || 'TITLE'}
           </h1>
         </div>
         <div className="flex-1 flex flex-col min-h-0">
           {gridFields.map((f, i) => (
             <div 
               key={f.id} 
               className={`flex flex-1 border-black cursor-pointer transition-colors ${selectedFieldId === f.id ? 'bg-blue-50/50' : ''}`}
               style={{ borderBottomWidth: i !== gridFields.length - 1 ? c.tabBorder : 0 }}
               onClick={() => onSelectField(f.id)}
             >
               <div 
                 className="w-1/2 flex items-center justify-center p-2 overflow-hidden border-black"
                 style={{ borderRightWidth: c.tabBorder, ...getStyleObj(f.styles) }}
               >
                 <span className={`${c.tabText} font-normal truncate block w-full text-center`} title={f.label}>{f.label}</span>
               </div>
               <div className="w-1/2 flex items-center justify-center p-2 overflow-hidden" style={getStyleObj(f.styles)}>
                 <span className={`${c.tabText} font-normal truncate block w-full text-center`} title={f.value}>{f.value}</span>
               </div>
             </div>
           ))}
         </div>
      </div>
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

  const InteractiveBlock = ({ field, defaultClasses, children }: { field?: LabelField, defaultClasses: string, children: React.ReactNode }) => {
    if (!field) return <div className={defaultClasses}>{children}</div>;
    const isSelected = selectedFieldId === field.id;
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
        className={`${defaultClasses} cursor-pointer transition-colors outline-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : 'hover:bg-gray-50/50 rounded'}`}
        style={getStyleObj(field.styles)}
      >
        {children}
      </div>
    );
  };

  return (
    <div 
      className={`bg-white shadow-2xl rounded-sm ${c.pad} flex flex-col border border-gray-300 relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden`}
      style={printDims[size]}
      id="print-label"
      onClick={() => onSelectField('')} // deselect
    >
      {/* Header area */}
      <div className={`flex justify-between items-start border-black shrink-0 ${c.gap1}`}>
        <div className="flex-1 min-w-0 mr-3 space-y-1">
          <InteractiveBlock field={productField} defaultClasses="w-full">
            <h1 className={`${c.title} font-black uppercase tracking-tighter leading-none truncate`} title={productField?.value || 'PRODUCT NAME'}>
              {productField?.value || 'PRODUCT NAME'}
            </h1>
          </InteractiveBlock>
          <InteractiveBlock field={skuField} defaultClasses="w-full">
            <p className={`${c.sku} font-medium text-gray-600 uppercase truncate`} title={skuField?.value || 'XXXXX'}>
              SKU: {skuField?.value || 'XXXXX'}
            </p>
          </InteractiveBlock>
        </div>
        <div className="text-right shrink-0">
          <InteractiveBlock field={rollField} defaultClasses="inline-block">
            <span className={`${c.roll} font-bold bg-black text-white uppercase tracking-widest whitespace-nowrap inline-block`}>
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
              <div className="font-semibold">{f.value}</div>
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
         <InteractiveBlock field={sysField} defaultClasses="mt-2 text-center max-w-full">
           <p className={`${c.sysId} font-mono font-medium text-gray-900 truncate max-w-full mt-0`}>
             {sysField?.value || 'SYS-000000'}
           </p>
         </InteractiveBlock>
      </div>

      {/* Footer area */}
      <div className={`shrink-0 border-t border-gray-300 flex justify-between items-end ${c.gap2}`}>
        <div className="flex-1 min-w-0 pr-4">
           <InteractiveBlock field={batchField} defaultClasses="w-full">
             <p className={`${c.footerLabel} text-gray-400 uppercase tracking-widest mb-0.5 truncate`}>Batch Number</p>
             <p className={`${c.footerVal} font-semibold truncate`} title={batchField?.value || 'BN-XXXX'}>
               {batchField?.value || 'BN-XXXX'}
             </p>
           </InteractiveBlock>
        </div>
        <div className={`${c.qcSize} border-black rounded-full flex items-center justify-center shrink-0`}>
          <span className="font-bold leading-none mt-0.5">QC</span>
        </div>
      </div>
    </div>
  );
}
