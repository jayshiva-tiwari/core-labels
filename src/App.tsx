/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { TopBar } from './components/TopBar';
import { LeftTools } from './components/LeftTools';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FieldConfigCard } from './components/FieldConfigCard';
import { LabelMockup } from './components/LabelMockup';
import { LabelSize, LabelField, LabelTemplate, LabelStyle } from './types';

const INITIAL_STANDARD_FIELDS: LabelField[] = [
  { id: '1', label: 'System ID', value: 'SYS-8092X', readOnly: true },
  { id: '2', label: 'Roll Number', value: 'E01080-26-A-01', reorderable: true, isRollNumber: true, isLocked: true, readOnly: true },
  { id: '3', label: 'Product Name', value: 'Industrial Widget', reorderable: true },
  { id: '4', label: 'SKU', value: 'SKU-77XQ9', reorderable: true },
  { id: '5', label: 'Batch Number', value: 'BN-9001-A', reorderable: true },
];

const INITIAL_TABULAR_FIELDS: LabelField[] = [
  { id: 't1', label: 'Product', value: 'PP Non-woven Needle punch\nFabric Uncalendared', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't2', label: 'Colour', value: '902 GREY', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't3', label: 'Lot no', value: 'NP26/08/02', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't4', label: 'Roll no', value: 'E01080-26-A-01', reorderable: true, isRollNumber: true, isLocked: true, readOnly: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't5', label: 'width', value: '4.30 M', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't6', label: 'GSM', value: '140.0', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't7', label: 'Length', value: '200', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't8', label: 'Weight', value: '119', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
  { id: 't9', label: 'Manufacturing Date', value: '03-08-2026', reorderable: true, styles: { showColon: true, columnWidth: 35, textAlign: 'center' } },
];

const INITIAL_ROLL_DATA_FIELDS: LabelField[] = [
  { id: 'rd1', label: '', value: 'ROLL DATA', reorderable: true, styles: { fullWidth: true, textAlign: 'center', bold: true, fontSize: 16 } },
  { id: 'rd2', label: 'Product code', value: 'FLOOR PRODUCTION', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd3', label: 'Roll No', value: 'E01080-26-A-01', reorderable: true, isRollNumber: true, isLocked: true, readOnly: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd4', label: 'COLOUR', value: 'PET-GREY', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd5', label: 'WIDHT (M)', value: '1.4', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd6', label: 'LENGTH-MTR', value: '346', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd7', label: 'GSM-RAG', value: '120 TO 140', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd8', label: 'Sq-MTR', value: '484.4', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd9', label: 'AVG GSM', value: '140.0', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd10', label: 'TARE WEIGTH', value: '3.5', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd11', label: 'NET WEIGHT', value: '58', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
  { id: 'rd12', label: 'GR. WEIGHT', value: '61.5', reorderable: true, styles: { columnWidth: 45, textAlign: 'center', bold: true } },
];

export default function App() {
  const [activeSize, setActiveSize] = useState<LabelSize>('4x4');
  const [activeTemplate, setActiveTemplate] = useState<LabelTemplate>('tabular');
  
  const [standardFields, setStandardFields] = useState<LabelField[]>(INITIAL_STANDARD_FIELDS);
  const [tabularFields, setTabularFields] = useState<LabelField[]>(INITIAL_TABULAR_FIELDS);
  const [rollDataFields, setRollDataFields] = useState<LabelField[]>(INITIAL_ROLL_DATA_FIELDS);
  const [blankFields, setBlankFields] = useState<LabelField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('labelConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        
        const migrateFields = (fields) => {
          if (!fields) return fields;
          return fields.map(f => {
            if (f.id === '2' || f.id === 't4' || f.id === 'rd3') {
              return { ...f, isRollNumber: true, isLocked: true, readOnly: true };
            }
            return f;
          });
        };
        
        if (config.activeSize) setActiveSize(config.activeSize);
        if (config.activeTemplate) setActiveTemplate(config.activeTemplate);
        if (config.standardFields) setStandardFields(migrateFields(config.standardFields));
        if (config.tabularFields) setTabularFields(migrateFields(config.tabularFields));
        if (config.rollDataFields) setRollDataFields(migrateFields(config.rollDataFields));
        if (config.blankFields) setBlankFields(config.blankFields);

      } catch (e) {
        console.error('Failed to load saved config', e);
      }
    }
  }, []);


  
  useEffect(() => {
    try {
      const config = {
        activeSize,
        activeTemplate,
        standardFields,
        tabularFields,
        rollDataFields,
        blankFields
      };
      // only save if they are populated (prevents overwriting on initial mount if state is empty)
      if (standardFields.length > 0) {
        localStorage.setItem('labelConfig', JSON.stringify(config));
      }
    } catch(e) {}
  }, [activeSize, activeTemplate, standardFields, tabularFields, rollDataFields, blankFields]);

  // Auto-save happens here now
  const currentFields = activeTemplate === 'standard' ? standardFields : activeTemplate === 'tabular' ? tabularFields : activeTemplate === 'roll-data' ? rollDataFields : blankFields;
  const setCurrentFields = activeTemplate === 'standard' ? setStandardFields : activeTemplate === 'tabular' ? setTabularFields : activeTemplate === 'roll-data' ? setRollDataFields : setBlankFields;
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
      setActiveTemplate(activeTemplate === 'standard' ? 'tabular' : activeTemplate === 'tabular' ? 'roll-data' : activeTemplate === 'roll-data' ? 'blank' : 'standard');
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

  
  
  const handlePrint = () => {
    window.print();
    
    // Auto-increment logic
    const incrementValue = (val) => {
      const match = val.match(/(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const numStr = match[2];
        const nextNum = String(parseInt(numStr, 10) + 1).padStart(numStr.length, '0');
        return prefix + nextNum;
      }
      return val;
    };

    const updateFields = (fields) => 
      fields.map(f => f.isRollNumber ? { ...f, value: incrementValue(f.value) } : f);

    const newStandard = updateFields(standardFields);
    const newTabular = updateFields(tabularFields);
    const newRollData = updateFields(rollDataFields);

    setStandardFields(newStandard);
    setTabularFields(newTabular);
    setRollDataFields(newRollData);
    
    // Save to local storage automatically after increment
    try {
      const config = {
        activeSize,
        activeTemplate,
        standardFields: newStandard,
        tabularFields: newTabular,
        rollDataFields: newRollData,
        blankFields
      };
      localStorage.setItem('labelConfig', JSON.stringify(config));
    } catch(e) {}
  };

  const handleSave = () => {
    try {
      const config = {
        activeSize,
        activeTemplate,
        standardFields,
        tabularFields,
        rollDataFields,
        blankFields
      };
      localStorage.setItem('labelConfig', JSON.stringify(config));
      alert('Label configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration.');
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('print-label');
    if (!element) {
      alert('Label element not found for export.');
      return;
    }
    
    // Temporarily remove shadow for export
    const originalBoxShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          boxShadow: 'none'
        }
      });
      
      const link = document.createElement('a');
      link.download = `label-export-${activeSize}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export image.');
    } finally {
      // Restore shadow
      element.style.boxShadow = originalBoxShadow;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] text-gray-900 font-sans overflow-hidden">
      <div className="print:hidden"><TopBar 
        activeSize={activeSize} 
        onSizeChange={setActiveSize} 
        activeTemplate={activeTemplate}
        onTemplateChange={setActiveTemplate}
        onPrint={handlePrint}
        onSave={handleSave}
        onExport={handleExport}
      /></div>
      
      <div className="flex flex-1 overflow-hidden relative print:block print:w-full print:h-full print:m-0 print:p-0">
        <div className="print:hidden"><LeftTools onAddTool={handleAddToolElement} /></div>
        
        <div className="flex-1 relative bg-grid-pattern overflow-auto print:overflow-visible print:bg-none print:w-full print:h-full">
          <div className="absolute inset-0 flex p-8 gap-12 min-w-[900px] min-h-[600px] items-center print:static print:block print:p-0 print:m-0 print:min-w-0 print:min-h-0">
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
            <div className="flex-1 flex items-center justify-center pr-12 print:pr-0 print:block" id="print-area">
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

        <div className="print:hidden"><PropertiesPanel 
          activeField={activeField} 
          onUpdateStyle={handleUpdateStyle}
          onUpdateAllStyles={handleUpdateAllStyles}
          onDeleteField={handleDeleteField}
          activeTemplate={activeTemplate}
        /></div>
      </div>
    </div>
  );
}
