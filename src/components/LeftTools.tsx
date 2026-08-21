import React from 'react';
import { Type, Square, Image as ImageIcon, Barcode, LayoutTemplate } from 'lucide-react';

const tools = [
  { icon: Type, label: 'Text' },
  { icon: Square, label: 'Shapes' },
  { icon: ImageIcon, label: 'Images' },
  { icon: Barcode, label: 'Barcodes' },
  { icon: LayoutTemplate, label: 'Templates' },
];

interface LeftToolsProps {
  onAddTool: (type: string) => void;
}

export function LeftTools({ onAddTool }: LeftToolsProps) {
  return (
    <div className="w-24 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6 z-10 shadow-sm relative">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={() => onAddTool(tool.label)}
          className="flex flex-col items-center space-y-2 text-gray-500 hover:text-black transition-colors group w-full"
        >
          <div className="p-3 rounded-xl group-hover:bg-gray-100 transition-colors">
            <tool.icon size={22} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-medium">{tool.label}</span>
        </button>
      ))}
    </div>
  );
}
