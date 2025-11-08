'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLatencyStore } from '@/lib/latencyStore';
import { format } from 'date-fns';

type Props = { edgeId?: string };

export default function LatencyChart({ edgeId }: Props) {
  const edge = useLatencyStore(s => edgeId ? s.edges[edgeId] : Object.values(s.edges)[0]);

  if (!edge) return <div className="text-white/80 text-sm">Select a link to see history…</div>;

  const data = edge.history.map(h => ({ t: format(h.t, 'HH:mm:ss'), ms: h.ms }));

  return (
    <div className="h-56 w-full bg-zinc-900/60 rounded-2xl p-3">
      <div className="text-white font-semibold mb-2 truncate">Latency: {edge.id}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ms" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
