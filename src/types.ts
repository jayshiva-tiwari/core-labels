export type LabelSize = '4x4' | '2x2' | '4x6' | '4x2';

export interface LabelField {
  id: string;
  label: string;
  value: string;
  readOnly?: boolean;
  reorderable?: boolean;
}
