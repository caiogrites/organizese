import { InjectionToken } from '@angular/core'
import { saveAs } from 'file-saver';

export type Saver = (blob: any, filename?: string) => void

export const SAVER = new InjectionToken<Saver>('saver')

export function getSaver(): Saver {
  return saveAs;
}