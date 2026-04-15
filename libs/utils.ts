import {clsx} from 'clsx'
import type {ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs:ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getThaiVisualLength (text:string):number {
  // This regex matches Thai combining marks (vowels above/below and tone marks)
  // Range: \u0E31, \u0E34-\u0E3A, \u0E47-\u0E4E
  const thaiMarksRegex = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;
  return text.replace(thaiMarksRegex, '').length;
};