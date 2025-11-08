'use client';
import { useLatencyStore, selectEdges } from '@/lib/latencyStore';
import { useMemo } from 'react';

export default function StatsBar() {
  const edges = useLatencyStore(selectEdges);

  const stats = useMemo(() => {
    const arr = Object.values(edges);
    if (!arr.length) return null;
    const msArr = arr.map(e => e.lastMs);
    const min = Math.min(...msArr);
    const max = Math.max(...msArr);
    const avg = Math.round(msArr.reduce((a,b)=>a+b,0)/msArr.length);
    return { count: arr.length, min, avg, max };
  }, [edges]);

  if (!stats) return null;

  return (
    <div className="px-4 py-2 bg-black/60 rounded-xl text-white text-sm">
      <span className="font-semibold">System:</span>{' '}
      Edges {stats.count} • Min {stats.min}ms • Avg {stats.avg}ms • Max {stats.max}ms
    </div>
  );
}
