
export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAi?: boolean;
}

export type CalculatorMode = 'standard' | 'scientific' | 'ai';

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'action' | 'scientific';
  span?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}
