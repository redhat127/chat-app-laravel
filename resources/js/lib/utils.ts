import { clientEnvs } from '@/env';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateTitle = (title: string) => {
  return `${clientEnvs.VITE_APP_NAME} - ${title}`;
};
