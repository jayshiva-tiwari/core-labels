import React from 'react';
import { LabelField } from '../types';
import { Image as ImageIcon, Barcode, Square } from 'lucide-react';

interface FieldContentProps {
  field: LabelField;
  className?: string;
  style?: React.CSSProperties;
}

export function FieldContent({ field, className = '', style = {} }: FieldContentProps) {
  if (field.type === 'image') {
    return (
      <div className={`w-full flex items-center justify-center p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded ${className}`} style={{ minHeight: '60px', ...style }}>
        <ImageIcon className="text-gray-400" size={32} />
      </div>
    );
  }

  if (field.type === 'barcode') {
    return (
      <div className={`w-full flex flex-col items-center justify-center py-2 ${className}`} style={style}>
        <div className="flex h-12 w-full max-w-[80%] items-end justify-center gap-[2px] opacity-90 mx-auto">
          {Array.from({length: 30}).map((_, i) => (
            <div key={i} className={`h-full ${i % 5 === 0 ? 'w-1.5' : i % 3 === 0 ? 'w-1' : i % 7 === 0 ? 'w-2' : 'w-[2px]'}`} style={{ backgroundColor: field.styles?.color || '#000' }} />
          ))}
        </div>
        {field.value && <div className="font-mono mt-1 text-center font-semibold tracking-widest">{field.value}</div>}
      </div>
    );
  }

  if (field.type === 'shape') {
    return (
      <div className={`w-full flex items-center justify-center py-2 ${className}`}>
         <div 
           className="w-16 h-16 border-2 border-black bg-black rounded-sm transition-all" 
           style={{ 
             backgroundColor: field.styles?.color || '#000', 
             borderColor: field.styles?.color || '#000',
             borderRadius: field.styles?.borderRadius ? `${field.styles.borderRadius}px` : undefined,
             width: field.styles?.fontSize ? `${field.styles.fontSize * 2}px` : '64px',
             height: field.styles?.fontSize ? `${field.styles.fontSize * 2}px` : '64px'
           }} 
         />
      </div>
    );
  }

  // Default text
  return (
    <span className={`block w-full ${className}`} style={style} title={field.value}>
      {field.value}
    </span>
  );
}
