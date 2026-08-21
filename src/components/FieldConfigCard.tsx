import React, { useState } from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { LabelField } from '../types';

interface FieldConfigCardProps {
  fields: LabelField[];
  onUpdateFields: (fields: LabelField[]) => void;
}

export function FieldConfigCard({ fields, onUpdateFields }: FieldConfigCardProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    if (fields[index].readOnly) return; // Prevent replacing read-only

    const newFields = [...fields];
    const draggedItem = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    onUpdateFields(newFields);
  };

  const handleDrop = () => {
    setDraggedIndex(null);
  };

  const handleChange = (index: number, val: string) => {
    const newFields = [...fields];
    newFields[index].value = val;
    onUpdateFields(newFields);
  };

  const handleAddField = () => {
    const newId = `field-${Date.now()}`;
    onUpdateFields([
      ...fields,
      { id: newId, label: 'Custom Field', value: '', reorderable: true }
    ]);
  };

  return (
    <div className="w-[340px] bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-200 overflow-hidden flex flex-col h-[520px]">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Configure Label Contents</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {fields.map((field, idx) => {
          const isReadOnly = field.readOnly;
          return (
            <div
              key={field.id}
              draggable={!isReadOnly}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={handleDrop}
              onDragEnd={handleDrop}
              className={`flex items-center space-x-2 p-3 rounded-xl transition-colors group ${
                draggedIndex === idx ? 'opacity-40 bg-gray-100 border-dashed border border-gray-300' : 'hover:bg-gray-50 bg-white border border-transparent'
              } ${isReadOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <div className={`flex items-center justify-center w-5 text-gray-300 ${isReadOnly ? 'opacity-0' : 'group-hover:text-gray-500'}`}>
                {!isReadOnly && <GripVertical size={16} />}
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full text-sm p-2.5 rounded-lg outline-none border transition-colors ${
                    isReadOnly
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-transparent border-gray-300 focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={handleAddField}
          className="flex items-center justify-center w-full space-x-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Field</span>
        </button>
      </div>
    </div>
  );
}
