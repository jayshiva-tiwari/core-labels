import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, Lock, Unlock, Edit3 } from 'lucide-react';
import { LabelField } from '../types';

interface FieldConfigCardProps {
  fields: LabelField[];
  onUpdateFields: (fields: LabelField[]) => void;
  selectedFieldId?: string | null;
  onSelectField?: (id: string) => void;
}

export function FieldConfigCard({ fields, onUpdateFields, selectedFieldId, onSelectField }: FieldConfigCardProps) {
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
    newFields[index] = { ...newFields[index], value: val };
    onUpdateFields(newFields);
  };

  const handleLabelChange = (index: number, labelVal: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], label: labelVal };
    onUpdateFields(newFields);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFields = fields.filter((f) => f.id !== id);
    onUpdateFields(newFields);
    if (selectedFieldId === id && onSelectField) {
      onSelectField('');
    }
  };

  
  const handleUnlock = (index, field) => {
    if (!field.isLocked) return;
    const pwd = window.prompt('Enter admin password to manually override the roll number:');
    if (pwd === 'admin123') {
      const newFields = [...fields];
      newFields[index] = { ...newFields[index], isLocked: false, readOnly: false };
      onUpdateFields(newFields);
    } else if (pwd !== null) {
      alert('Incorrect password.');
    }
  };

  const handleBlurOrEnter = (index, field) => {
    if (field.isRollNumber && !field.isLocked) {
      const newFields = [...fields];
      newFields[index] = { ...newFields[index], isLocked: true, readOnly: true };
      onUpdateFields(newFields);
      
      // Auto-save happens in App.tsx typically, but let's fire a quick save 
      try {
        const saved = localStorage.getItem('labelConfig');
        if (saved) {
          const config = JSON.parse(saved);
          // Just let App handle it, or we trigger a change that App sees.
          // App handles it by updating state, which triggers a re-render. We'd have to save to localstorage in App.
        }
      } catch(e) {}
    }
  };

  const handleClearFields = () => {
    onUpdateFields([]);
    if (onSelectField) {
      onSelectField('');
    }
  };

  const handleAddField = () => {
    const newId = `field-${Date.now()}`;
    const newField: LabelField = {
      id: newId,
      label: `Field ${fields.length + 1}`,
      value: 'New Value',
      reorderable: true
    };
    onUpdateFields([...fields, newField]);
    if (onSelectField) {
      onSelectField(newId);
    }
  };

  return (
    <div className="w-[340px] bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-200 overflow-hidden flex flex-col h-[520px]">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Configure Label Contents</h2>
        <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {fields.length} {fields.length === 1 ? 'Field' : 'Fields'}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {fields.map((field, idx) => {
          const isReadOnly = field.readOnly || field.isLocked;
          const isSelected = selectedFieldId === field.id;
          return (
            <div
              key={field.id}
              draggable={!isReadOnly}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={handleDrop}
              onDragEnd={handleDrop}
              onClick={() => onSelectField && onSelectField(field.id)}
              className={`flex items-start space-x-2 p-3 rounded-xl transition-all group ${
                draggedIndex === idx
                  ? 'opacity-40 bg-gray-100 border-dashed border border-gray-300'
                  : isSelected
                  ? 'bg-blue-50/80 border border-blue-200 shadow-xs'
                  : 'hover:bg-gray-50 bg-white border border-transparent'
              } ${isReadOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <div className={`flex items-center justify-center w-5 pt-3 text-gray-300 ${isReadOnly ? 'opacity-0' : 'group-hover:text-gray-500'}`}>
                {!isReadOnly && <GripVertical size={16} />}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleLabelChange(idx, e.target.value)}
                    disabled={isReadOnly}
                    className={`text-[11px] font-semibold uppercase tracking-wider bg-transparent outline-none truncate pr-1 ${
                      isReadOnly ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black focus:text-black'
                    }`}
                    title={field.label}
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(field.id, e)}
                      title="Delete field"
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                <input
                  type="text"
                  value={field.value}
                  onBlur={() => handleBlurOrEnter(idx, field)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleBlurOrEnter(idx, field); }}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full text-sm p-2.5 rounded-lg outline-none border transition-colors ${
                    isReadOnly
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400'
                  }`}
                />
                {field.isRollNumber && field.isLocked && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUnlock(idx, field); }}
                    className="absolute right-2 text-gray-400 hover:text-black p-1 bg-gray-100 rounded"
                    title="Unlock to override sequence"
                  >
                    <Lock size={14} />
                  </button>
                )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-2">
        <button
          onClick={handleClearFields}
          title="Clear Canvas"
          className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={handleAddField}
          className="flex-1 flex items-center justify-center space-x-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Add Field</span>
        </button>
      </div>
    </div>
  );
}
