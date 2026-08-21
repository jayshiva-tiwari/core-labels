import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { LabelField, LabelStyle } from '../types';

interface PropertiesPanelProps {
  activeField?: LabelField;
  onUpdateStyle: (id: string, style: Partial<LabelStyle>) => void;
}

export function PropertiesPanel({ activeField, onUpdateStyle }: PropertiesPanelProps) {
  const styles = activeField?.styles || {};
  const alignments: ('left'|'center'|'right'|'justify')[] = ['left', 'center', 'right', 'justify'];
  const AlignmentIcons = [AlignLeft, AlignCenter, AlignRight, AlignJustify];

  const update = (key: keyof LabelStyle, val: any) => {
    if (!activeField) return;
    onUpdateStyle(activeField.id, { [key]: val });
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto z-10 shadow-sm relative">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Properties</h2>
        {activeField && (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded truncate max-w-[120px]">{activeField.label}</span>
        )}
      </div>

      {!activeField ? (
        <div className="p-8 text-center text-sm text-gray-400">
          Click an element on the canvas to configure its properties.
        </div>
      ) : (
      <div className="p-5 space-y-7">
        {/* Font Family */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Font Family</label>
          <select 
            value={styles.fontFamily || 'Inter'}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full border border-gray-300 rounded-md text-sm p-2.5 focus:ring-1 focus:ring-black outline-none bg-white hover:border-gray-400 transition-colors"
          >
            <option value="Inter">Inter</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Roboto">Roboto</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        {/* Size & Color */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Appearance</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={styles.color || '#000000'}
              onChange={(e) => update('color', e.target.value)}
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer overflow-hidden p-0"
            />
            <div className="flex-1 flex items-center border border-gray-300 rounded-md overflow-hidden bg-white hover:border-gray-400 transition-colors">
              <input 
                type="range" 
                className="w-full mx-3 accent-black" 
                min="8" max="72" 
                value={styles.fontSize || 14} 
                onChange={(e) => update('fontSize', parseInt(e.target.value))} 
              />
              <input 
                type="number" 
                value={styles.fontSize || 14} 
                onChange={(e) => update('fontSize', parseInt(e.target.value))} 
                className="w-12 text-sm border-l border-gray-300 p-2 outline-none text-center" 
              />
            </div>
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Alignment</label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
            {AlignmentIcons.map((Icon, idx) => {
              const align = alignments[idx];
              const isActive = (styles.textAlign || 'left') === align;
              return (
                <button 
                  key={align} 
                  onClick={() => update('textAlign', align)}
                  className={`flex-1 p-2.5 flex justify-center items-center hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 text-black' : 'text-gray-500'}`}
                >
                  <Icon size={16} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Border */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Border Config</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">WIDTH (PX)</span>
              <input 
                type="number" 
                value={styles.borderWidth || 0}
                onChange={(e) => update('borderWidth', parseInt(e.target.value) || 0)} 
                className="w-full border border-gray-300 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-black hover:border-gray-400 transition-colors" 
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">RADIUS (PX)</span>
              <input 
                type="number" 
                value={styles.borderRadius || 0}
                onChange={(e) => update('borderRadius', parseInt(e.target.value) || 0)} 
                className="w-full border border-gray-300 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-black hover:border-gray-400 transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
