import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

export function PropertiesPanel() {
  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto z-10 shadow-sm relative">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Properties</h2>
      </div>

      <div className="p-5 space-y-7">
        {/* Font Family */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Font Family</label>
          <select className="w-full border border-gray-300 rounded-md text-sm p-2.5 focus:ring-1 focus:ring-black outline-none bg-white hover:border-gray-400 transition-colors">
            <option>Inter</option>
            <option>Montserrat</option>
            <option>Roboto</option>
            <option>Monospace</option>
          </select>
        </div>

        {/* Size & Color */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Appearance</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              defaultValue="#000000"
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer overflow-hidden p-0"
            />
            <div className="flex-1 flex items-center border border-gray-300 rounded-md overflow-hidden bg-white hover:border-gray-400 transition-colors">
              <input type="range" className="w-full mx-3 accent-black" min="8" max="72" defaultValue="14" />
              <input type="number" defaultValue="14" className="w-12 text-sm border-l border-gray-300 p-2 outline-none text-center" />
            </div>
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Alignment</label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
            {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, idx) => (
              <button key={idx} className={`flex-1 p-2.5 flex justify-center items-center hover:bg-gray-100 transition-colors ${idx === 0 ? 'bg-gray-100 text-black' : 'text-gray-500'}`}>
                <Icon size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {/* Border */}
        <div className="space-y-3">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Border Config</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">WIDTH (PX)</span>
              <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-black hover:border-gray-400 transition-colors" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">RADIUS (PX)</span>
              <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-black hover:border-gray-400 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
