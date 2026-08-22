export type LabelSize = '4x4' | '2x2' | '4x6' | '4x2';
export type LabelTemplate = 'standard' | 'tabular' | 'roll-data' | 'blank';

export interface LabelStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderWidth?: number;
  borderRadius?: number;
  fullWidth?: boolean;
  columnWidth?: number;
  rightColumnWidth?: number;
  rowHeight?: number;
  showColon?: boolean;
  colonWidth?: number;
  bold?: boolean;
}

export interface LabelField {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'shape' | 'image' | 'barcode';
  readOnly?: boolean;
  reorderable?: boolean;
  styles?: LabelStyle;
}

