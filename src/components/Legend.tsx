'use client';
import { providerColor } from '@/lib/colors';

export default function Legend() {
  return (
    <div
      aria-label="Legend"
      className="flex flex-wrap items-center gap-4 text-sm p-2 bg-black/50 rounded-xl text-white"
    >
      <span className="font-semibold">Legend:</span>
      {(['AWS','GCP','AZURE'] as const).map(p => (
        <span key={p} className="flex items-center gap-2">
          <span aria-hidden className="w-3 h-3 rounded-full" style={{ background: providerColor[p] }} />
          <span>{p}</span>
        </span>
      ))}
      <span className="ml-4">
        Latency: <span className="text-green-400">Low</span> → <span className="text-yellow-300">Med</span> → <span className="text-red-400">High</span>
      </span>
    </div>
  );
}
