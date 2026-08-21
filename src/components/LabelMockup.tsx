import React, { useRef, useEffect, useState } from 'react';
import { LabelField, LabelSize } from '../types';

interface LabelMockupProps {
  fields: LabelField[];
  size: LabelSize;
}

export function LabelMockup({ fields, size }: LabelMockupProps) {
  // Dimensions based on size selection
  const sizeClasses = {
    '4x4': 'w-[400px] h-[400px]',
    '2x2': 'w-[250px] h-[250px]',
    '4x6': 'w-[400px] h-[600px]',
    '4x2': 'w-[400px] h-[200px]',
  };

  const config = {
    '4x4': {
      pad: 'p-8',
      title: 'text-3xl',
      sku: 'text-sm',
      roll: 'text-xs px-2 py-1',
      gap1: 'pb-4 mb-4 border-b-2',
      barcodePy: 'py-6',
      barcodeH: 'h-24',
      sysId: 'text-sm tracking-[0.3em] mt-3',
      gap2: 'pt-4 mt-4',
      footerLabel: 'text-[10px]',
      footerVal: 'text-base',
      qcSize: 'w-12 h-12 text-lg border-2'
    },
    '4x2': {
      pad: 'p-4',
      title: 'text-xl',
      sku: 'text-xs',
      roll: 'text-[10px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]',
      barcodePy: 'py-2',
      barcodeH: 'h-10',
      sysId: 'text-[10px] tracking-[0.2em] mt-1.5',
      gap2: 'pt-2 mt-2',
      footerLabel: 'text-[8px]',
      footerVal: 'text-sm',
      qcSize: 'w-8 h-8 text-xs border-[1.5px]'
    },
    '2x2': {
      pad: 'p-4',
      title: 'text-lg',
      sku: 'text-[10px]',
      roll: 'text-[8px] px-1.5 py-0.5',
      gap1: 'pb-2 mb-2 border-b-[1.5px]',
      barcodePy: 'py-2',
      barcodeH: 'h-12',
      sysId: 'text-[9px] tracking-[0.2em] mt-2',
      gap2: 'pt-2 mt-2',
      footerLabel: 'text-[8px]',
      footerVal: 'text-xs',
      qcSize: 'w-8 h-8 text-xs border-[1.5px]'
    },
    '4x6': {
      pad: 'p-8',
      title: 'text-4xl',
      sku: 'text-base',
      roll: 'text-sm px-2 py-1',
      gap1: 'pb-6 mb-6 border-b-2',
      barcodePy: 'py-8',
      barcodeH: 'h-32',
      sysId: 'text-base tracking-[0.3em] mt-4',
      gap2: 'pt-6 mt-6',
      footerLabel: 'text-[12px]',
      footerVal: 'text-xl',
      qcSize: 'w-16 h-16 text-xl border-2'
    }
  };

  const findValue = (labelQuery: string) => {
    return fields.find(f => f.label.toLowerCase().includes(labelQuery.toLowerCase()))?.value || '';
  };

  const systemId = findValue('system id');
  const rollNumber = findValue('roll number');
  const productName = findValue('product name');
  const sku = findValue('sku');
  const batchNumber = findValue('batch number');

  const c = config[size];

  return (
    <div className={`bg-white shadow-2xl rounded-sm ${c.pad} flex flex-col border border-gray-300 relative transition-all duration-300 ease-in-out ${sizeClasses[size]} mx-auto my-auto overflow-hidden`}>
      {/* Header area */}
      <div className={`flex justify-between items-start border-black shrink-0 ${c.gap1}`}>
        <div className="flex-1 min-w-0 mr-3">
          <h1 className={`${c.title} font-black uppercase tracking-tighter leading-none truncate`} title={productName || 'PRODUCT NAME'}>
            {productName || 'PRODUCT NAME'}
          </h1>
          <p className={`${c.sku} font-medium text-gray-600 mt-1 uppercase truncate`} title={sku || 'XXXXX'}>
            SKU: {sku || 'XXXXX'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className={`${c.roll} font-bold bg-black text-white uppercase tracking-widest whitespace-nowrap inline-block`}>
            {rollNumber || 'RL-00'}
          </span>
        </div>
      </div>

      {/* Barcode Mockup */}
      <div className={`flex-1 flex flex-col items-center justify-center min-h-0 ${c.barcodePy}`}>
         <div className={`flex ${c.barcodeH} w-full max-w-[80%] items-end justify-center gap-[2px] opacity-90`}>
           {Array.from({length: 45}).map((_, i) => (
              <div key={i} className={`h-full bg-black ${i % 7 === 0 ? 'w-1.5' : i % 4 === 0 ? 'w-1' : i % 11 === 0 ? 'w-2' : 'w-[2px]'}`} />
           ))}
         </div>
         <p className={`${c.sysId} font-mono font-medium text-gray-900 truncate max-w-full`}>
           {systemId || 'SYS-000000'}
         </p>
      </div>

      {/* Footer area */}
      <div className={`shrink-0 border-t border-gray-300 flex justify-between items-end ${c.gap2}`}>
        <div className="flex-1 min-w-0 pr-4">
           <p className={`${c.footerLabel} text-gray-400 uppercase tracking-widest mb-0.5 truncate`}>Batch Number</p>
           <p className={`${c.footerVal} font-semibold truncate`} title={batchNumber || 'BN-XXXX'}>
             {batchNumber || 'BN-XXXX'}
           </p>
        </div>
        <div className={`${c.qcSize} border-black rounded-full flex items-center justify-center shrink-0`}>
          <span className="font-bold leading-none mt-0.5">QC</span>
        </div>
      </div>
    </div>
  );
}
