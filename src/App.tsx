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
import { LabelSize, LabelField } from './types';

const INITIAL_FIELDS: LabelField[] = [
  { id: '1', label: 'System ID', value: 'SYS-8092X', readOnly: true },
  { id: '2', label: 'Roll Number', value: 'RL-1002', reorderable: true },
  { id: '3', label: 'Product Name', value: 'Industrial Widget', reorderable: true },
  { id: '4', label: 'SKU', value: 'SKU-77XQ9', reorderable: true },
  { id: '5', label: 'Batch Number', value: 'BN-9001-A', reorderable: true },
];

export default function App() {
  const [activeSize, setActiveSize] = useState<LabelSize>('4x4');
  const [fields, setFields] = useState<LabelField[]>(INITIAL_FIELDS);

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] text-gray-900 font-sans overflow-hidden">
      <TopBar activeSize={activeSize} onSizeChange={setActiveSize} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftTools />
        
        <div className="flex-1 relative bg-grid-pattern overflow-auto">
          <div className="absolute inset-0 flex p-8 gap-12 min-w-[900px] min-h-[600px] items-center">
            {/* Left Floating Card */}
            <div className="z-10 flex-shrink-0 ml-4">
              <FieldConfigCard fields={fields} onUpdateFields={setFields} />
            </div>
            
            {/* Center Canvas Area */}
            <div className="flex-1 flex items-center justify-center pr-12">
              <LabelMockup fields={fields} size={activeSize} />
            </div>
          </div>
        </div>

        <PropertiesPanel />
      </div>
    </div>
  );
}
