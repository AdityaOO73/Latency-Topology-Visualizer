import { CloudProvider } from './types';

export const providerColor: Readonly<Record<CloudProvider, string>> = {
  AWS:   '#f59e0b',
  GCP:   '#3b82f6',
  AZURE: '#10b981',
} as const;

export function latencyColor(ms: number): string {
  if (ms < 40)  return '#22c55e';
  if (ms < 120) return '#eab308';
  return '#ef4444';
}
