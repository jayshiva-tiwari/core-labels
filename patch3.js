const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  `export interface LabelField {
  id: string;
  label: string;
  value: string;
  readOnly?: boolean;
  reorderable?: boolean;
  styles?: LabelStyle;
}`,
  `export interface LabelField {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'shape' | 'image' | 'barcode';
  readOnly?: boolean;
  reorderable?: boolean;
  styles?: LabelStyle;
}`
);

fs.writeFileSync('src/types.ts', code);
