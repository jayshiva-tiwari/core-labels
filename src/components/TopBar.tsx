import React from 'react';
import { LabelSize, LabelTemplate } from '../types';

interface TopBarProps {
  activeSize: LabelSize;
  onSizeChange: (size: LabelSize) => void;
  activeTemplate: LabelTemplate;
  onTemplateChange: (template: LabelTemplate) => void;
  onPrint: () => void;
  onSave: () => void;
  onExport: () => void;
}

export function TopBar({ activeSize, onSizeChange, activeTemplate, onTemplateChange, onPrint, onSave, onExport }: TopBarProps) {
  return (
    <div className="flex flex-col w-full border-b border-gray-200 bg-white z-20 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Labels Core</h1>
        <p>By: JS. Tiwari</p>
        <div className="flex items-center space-x-3">
          <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Save
          </button>
          <button onClick={onExport} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Export
          </button>
          <button onClick={onPrint} className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors shadow-sm">
            Print Label
          </button>
        </div>
      </div>
      {/* Sub-header */}
      <div className="flex items-center px-6 py-3 bg-gray-50/50 justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 mr-4">Select Label Size:</span>
          <div className="flex bg-gray-200/60 p-1 rounded-lg">
            {(['4x4', '2x2', '4x6', '4x2'] as LabelSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeSize === size
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-600 mr-4">Template:</span>
          <div className="flex bg-gray-200/60 p-1 rounded-lg">
            {(['standard', 'tabular', 'roll-data', 'blank'] as LabelTemplate[]).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => onTemplateChange(tmpl)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${activeTemplate === tmpl
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tmpl.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
