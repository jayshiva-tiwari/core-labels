/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { LeftTools } from './components/LeftTools';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FieldConfigCard } from './components/FieldConfigCard';
import { LabelMockup } from './components/LabelMockup';
import { LabelSize, LabelField, LabelTemplate, LabelStyle } from './types';

const INITIAL_STANDARD_FIELDS: LabelField[] = [
  { id: '1', label: 'System ID', value: 'SYS-8092X', readOnly: true },
  { id: '2', label: 'Roll Number', value: 'RL-1002', reorderable: true },
  { id: '3', label: 'Product Name', value: 'Industrial Widget', reorderable: true },
  { id: '4', label: 'SKU', value: 'SKU-77XQ9', reorderable: true },
  { id: '5', label: 'Batch Number', value: 'BN-9001-A', reorderable: true },
];

const INITIAL_TABULAR_FIELDS: LabelField[] = [
  { id: 't1', label: 'Header Title', value: 'NEEDLE PUNCH FABRIC', reorderable: true, styles: { fullWidth: true } },
  { id: 't2', label: 'product', value: 'KT EXPORT', reorderable: true },
  { id: 't3', label: 'ROLL no', value: 'E01080-26-A-01', reorderable: true },
  { id: 't4', label: 'GSM', value: '120', reorderable: true },
  { id: 't5', label: 'meter', value: '100', reorderable: true },
  { id: 't6', label: 'WEIGHT', value: '50', reorderable: true },
];

export default function App() {
  const [activeSize, setActiveSize] = useState<LabelSize>('4x4');
  const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>('tabular');
  
  const [standardFields, setStandardFields] = useState<LabelField[]>(INITIAL_STANDARD_FIELDS);
  const [tabularFields, setTabularFields] = useState<LabelField[]>(INITIAL_TABULAR_FIELDS);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const currentFields = activeTemplate === 'standard' ? standardFields : tabularFields;
  const setCurrentFields = activeTemplate === 'standard' ? setStandardFields : setTabularFields;
  const activeField = currentFields.find(f => f.id === selectedFieldId);

  const handleUpdateStyle = (id: string, styleUpdates: Partial<LabelStyle>) => {
    setCurrentFields(currentFields.map(f => {
      if (f.id === id) {
        return { ...f, styles: { ...f.styles, ...styleUpdates } };
      }
      return f;
    }));
  };

  const handleUpdateAllStyles = (styleUpdates: Partial<LabelStyle>) => {
    setCurrentFields(currentFields.map(f => ({ ...f, styles: { ...f.styles, ...styleUpdates } })));
  };

  const handleDeleteField = (id: string) => {
    setCurrentFields(currentFields.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleAddToolElement = (type: string) => {
    if (type === 'Templates') {
      setActiveTemplate(activeTemplate === 'standard' ? 'tabular' : 'standard');
      return;
    }

    const fieldType = type === 'Text' ? 'text' :
                      type === 'Shapes' ? 'shape' :
                      type === 'Images' ? 'image' :
                      type === 'Barcodes' ? 'barcode' : 'text';

    const newField: LabelField = {
      id: `tool-${Date.now()}`,
      label: `New ${type}`,
      value: type === 'Text' ? `Custom Text` : type === 'Barcodes' ? '123456789' : '',
      type: fieldType,
      reorderable: true,
      styles: { fontFamily: 'Inter', fontSize: 14, color: '#000000', textAlign: 'center' }
    };
    setCurrentFields([...currentFields, newField]);
    setSelectedFieldId(newField.id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] text-gray-900 font-sans overflow-hidden">
      <TopBar 
        activeSize={activeSize} 
        onSizeChange={setActiveSize} 
        activeTemplate={activeTemplate}
        onTemplateChange={setActiveTemplate}
        onPrint={() => window.print()}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftTools onAddTool={handleAddToolElement} />
        
        <div className="flex-1 relative bg-grid-pattern overflow-auto">
          <div className="absolute inset-0 flex p-8 gap-12 min-w-[900px] min-h-[600px] items-center">
            {/* Left Floating Card */}
            <div className="z-10 flex-shrink-0 ml-4 print:hidden">
              <FieldConfigCard 
                fields={currentFields} 
                onUpdateFields={setCurrentFields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
              />
            </div>
            
            {/* Center Canvas Area */}
            <div className="flex-1 flex items-center justify-center pr-12" id="print-area">
              <LabelMockup 
                fields={currentFields} 
                size={activeSize} 
                template={activeTemplate}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
              />
            </div>
          </div>
        </div>

        <PropertiesPanel 
          activeField={activeField} 
          onUpdateStyle={handleUpdateStyle}
          onUpdateAllStyles={handleUpdateAllStyles}
          onDeleteField={handleDeleteField}
          activeTemplate={activeTemplate}
        />
      </div>
    </div>
  );
}
