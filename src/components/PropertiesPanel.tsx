import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2 } from 'lucide-react';
import { LabelField, LabelStyle, LabelTemplate } from '../types';

interface PropertiesPanelProps {
  activeField?: LabelField;
  onUpdateStyle: (id: string, style: Partial<LabelStyle>) => void;
  onUpdateAllStyles?: (style: Partial<LabelStyle>) => void;
  onDeleteField?: (id: string) => void;
  activeTemplate?: LabelTemplate;
}

export function PropertiesPanel({ activeField, onUpdateStyle, onUpdateAllStyles, onDeleteField, activeTemplate }: PropertiesPanelProps) {
  const styles = activeField?.styles || {};
  const alignments: ('left'|'center'|'right'|'justify')[] = ['left', 'center', 'right', 'justify'];
  const AlignmentIcons = [AlignLeft, AlignCenter, AlignRight, AlignJustify];

  const update = (key: keyof LabelStyle, val: any) => {
    if (!activeField) return;
    onUpdateStyle(activeField.id, { [key]: val });
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto z-10 shadow-sm relative flex flex-col justify-between">
      <div>
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
                  value={styles.fontSize || ''} 
                  placeholder="14"
                  onChange={(e) => update('fontSize', e.target.value ? parseInt(e.target.value) : undefined)} 
                  className="w-16 text-sm border-l border-gray-300 p-2 outline-none text-center" 
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

          {/* Table Layout */}
          {activeTemplate === 'tabular' && (
            <div className="space-y-3 border-t border-gray-100 pt-5 mt-2">
              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Table Row Layout</label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={!!styles.fullWidth}
                  onChange={(e) => update('fullWidth', e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Span Full Width (Title Row)</span>
              </label>

              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-400 block">ROW HEIGHT (PX)</span>
                  {styles.rowHeight && (
                    <button 
                      onClick={() => update('rowHeight', undefined)}
                      className="text-[10px] text-red-500 hover:text-red-700 transition-colors"
                    >
                      Reset (Auto)
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <input 
                    type="range" 
                    className="w-full accent-black" 
                    min="20" max="300" 
                    value={styles.rowHeight || 50} 
                    onChange={(e) => update('rowHeight', parseInt(e.target.value))} 
                  />
                  <input 
                    type="number" 
                    className="w-14 text-sm border border-gray-300 rounded-md p-1 outline-none text-center"
                    value={styles.rowHeight || ''} 
                    placeholder="Auto"
                    onChange={(e) => update('rowHeight', e.target.value ? parseInt(e.target.value) : undefined)} 
                  />
                </div>
                {onUpdateAllStyles && (
                  <button 
                    onClick={() => onUpdateAllStyles({ rowHeight: styles.rowHeight })}
                    className="text-[10px] text-gray-500 hover:text-black uppercase tracking-wider font-medium transition-colors block mb-2"
                  >
                    Apply height to all rows
                  </button>
                )}
              </div>

              {!styles.fullWidth && (
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 block mb-2">LEFT COLUMN WIDTH (%)</span>
                  <div className="flex items-center space-x-3 mb-3">
                    <input 
                      type="range" 
                      className="w-full accent-black" 
                      min="10" max="90" 
                      value={styles.columnWidth || 50} 
                      onChange={(e) => update('columnWidth', parseInt(e.target.value))} 
                    />
                    <span className="text-xs text-gray-500 w-8 text-right">{styles.columnWidth || 50}%</span>
                  </div>
                  {onUpdateAllStyles && (
                    <button 
                      onClick={() => onUpdateAllStyles({ columnWidth: styles.columnWidth || 50 })}
                      className="text-[10px] text-gray-500 hover:text-black uppercase tracking-wider font-medium transition-colors"
                    >
                      Apply width to all rows
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        )}
      </div>

      {activeField && !activeField.readOnly && onDeleteField && (
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => onDeleteField(activeField.id)}
            className="flex items-center justify-center w-full space-x-2 text-sm font-medium text-red-600 bg-red-50/60 border border-red-200 rounded-lg py-2.5 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete Field</span>
          </button>
        </div>
      )}
    </div>
  );
}
