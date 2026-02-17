
import { ButtonConfig } from './types';

export const STANDARD_BUTTONS: ButtonConfig[] = [
  { label: 'AC', value: 'clear', type: 'action', variant: 'danger' },
  { label: '±', value: 'negate', type: 'action', variant: 'secondary' },
  { label: '%', value: '%', type: 'operator', variant: 'secondary' },
  { label: '÷', value: '/', type: 'operator', variant: 'accent' },
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator', variant: 'accent' },
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operator', variant: 'accent' },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator', variant: 'accent' },
  { label: '0', value: '0', type: 'number', span: 2 },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'action', variant: 'primary' },
];

export const SCIENTIFIC_BUTTONS: ButtonConfig[] = [
  { label: 'sin', value: 'sin(', type: 'scientific', variant: 'secondary' },
  { label: 'cos', value: 'cos(', type: 'scientific', variant: 'secondary' },
  { label: 'tan', value: 'tan(', type: 'scientific', variant: 'secondary' },
  { label: 'log', value: 'log(', type: 'scientific', variant: 'secondary' },
  { label: 'ln', value: 'ln(', type: 'scientific', variant: 'secondary' },
  { label: 'π', value: 'Math.PI', type: 'scientific', variant: 'secondary' },
  { label: 'e', value: 'Math.E', type: 'scientific', variant: 'secondary' },
  { label: '^', value: '**', type: 'operator', variant: 'secondary' },
  { label: '√', value: 'sqrt(', type: 'scientific', variant: 'secondary' },
  { label: '(', value: '(', type: 'operator', variant: 'secondary' },
  { label: ')', value: ')', type: 'operator', variant: 'secondary' },
  { label: 'x!', value: 'factorial(', type: 'scientific', variant: 'secondary' },
];
