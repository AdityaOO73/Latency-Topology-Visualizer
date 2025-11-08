'use client';

import GlobeScene from '@/components/GlobeScene';
import ControlPanel from '@/components/ControlPanel';
import Legend from '@/components/Legend';
import StatsBar from '@/components/StatsBar';
import LatencyChart from '@/components/LatencyChart';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { useLatencyStore, selectEdges } from '@/lib/latencyStore';
import { exportCsv } from '@/lib/export';

export default function Page() {
  const [edgeId, setEdgeId] = useState<string | undefined>(undefined);
  const edges = useLatencyStore(selectEdges);

  const handleExport = () => {
    const rows = Object.values(edges).flatMap(e => e.history.map(h => ({ id: e.id, ms: h.ms, t: h.t })));
    exportCsv('latency-history.csv', rows);
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Latency Topology Visualizer</h1>
          <p className="text-white/60">3D exchanges + cloud regions • realtime arcs • historical trends</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center rounded-2xl border border-white/10 px-3 py-1.5 text-sm font-medium bg-black/40 hover:bg-white/10 transition"
          >
          Export CSV
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 space-y-3">
          <Legend />
          <StatsBar />
          <GlobeScene onSelectEdge={setEdgeId} />
          <LatencyChart edgeId={edgeId} />
        </div>

        <div className="space-y-3">
          <ControlPanel />
          <div className="bg-zinc-900/70 rounded-2xl border border-white/5 p-3 text-sm shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
            <div className="font-semibold mb-1">How to use</div>
            <ul className="list-disc ml-5 space-y-1">
              <li>Rotate globe (drag), zoom (wheel), pan (right-drag).</li>
              <li>Click an arc to inspect its history.</li>
              <li>Filter by provider, exchange, search, or latency range.</li>
              <li>Toggle regions/realtime layers.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
