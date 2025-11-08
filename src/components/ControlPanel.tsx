'use client';
import { useLatencyStore, selectFilters, selectSource } from '@/lib/latencyStore';
import { EXCHANGES } from '@/data/exchanges';
import { useDebounce } from '@/lib/useDebounce';
import type { LatencySource, Filters, CloudProvider } from '@/lib/types';

type ToggleKey = 'showRealtime' | 'showHistorical' | 'showRegions' | 'showHeatmap';
type ProviderKey = CloudProvider;

export default function ControlPanel() {
  const filters = useLatencyStore(selectFilters);
  const source  = useLatencyStore(selectSource);
  const setFilters = useLatencyStore(s => s.setFilters);
  const setSource  = useLatencyStore(s => s.setSource);

  const searchDeb = useDebounce(filters.search, 250);

  const toggleProvider = (p: ProviderKey) =>
    setFilters({ providers: { ...filters.providers, [p]: !filters.providers[p] } });

  const toggle = (k: ToggleKey) =>
    setFilters({ [k]: !filters[k] } as Partial<Filters>);

  const onLatencyChange = (idx: 0 | 1, v: number) => {
    const r: [number, number] = [filters.latencyRange[0], filters.latencyRange[1]];
    r[idx] = v;
    setFilters({ latencyRange: r });
  };

  const onExchangeSelect = (id: string) => {
    const exists = filters.exchanges.includes(id);
    const next = exists ? filters.exchanges.filter(x => x !== id) : [...filters.exchanges, id];
    setFilters({ exchanges: next });
  };

  const filteredExchanges = EXCHANGES.filter(e =>
    !searchDeb || e.name.toLowerCase().includes(searchDeb.toLowerCase())
  );

  const presetRanges: ReadonlyArray<readonly [number, number]> = [[0,60], [60,150], [150,300]];

  return (
    <div className="bg-zinc-900/70 rounded-2xl border border-white/5 p-3 space-y-3 w-full md:w-80 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Controls</div>
        <select
          aria-label="Data Source"
          className="w-36 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
          value={source}
          onChange={(e) => setSource(e.target.value as LatencySource)}
        >
          <option value="synthetic">Synthetic</option>
          <option value="api">API</option>
        </select>
      </div>

      <div>
        <label className="font-medium">Search</label>
        <input
          placeholder="Find exchange..."
          value={filters.search}
          onChange={(e)=>setFilters({ search: e.target.value })}
          className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40"
        />
      </div>

      <div>
        <div className="font-medium">Providers</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {(['AWS','GCP','AZURE'] as const).map(p => {
            const active = filters.providers[p];
            return (
              <button
                key={p}
                onClick={()=>toggleProvider(p)}
                className={`inline-flex items-center rounded-2xl border px-3 py-1.5 text-sm transition ${
                  active ? 'bg-white text-black border-transparent' : 'bg-black/40 border-white/10 hover:bg-white/10'
                }`}
                aria-pressed={active}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="font-medium">Exchanges</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {filteredExchanges.map(e => {
            const active = filters.exchanges.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={()=>onExchangeSelect(e.id)}
                className={`inline-flex items-center rounded-2xl border px-3 py-1.5 text-sm transition ${
                  active ? 'bg-white text-black border-transparent' : 'bg-black/40 border-white/10 hover:bg-white/10'
                }`}
                aria-pressed={active}
                title={e.name}
              >
                {e.name.split(' ')[0]}
              </button>
            );
          })}
          <button
            onClick={()=>setFilters({ exchanges: [] })}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-3 py-1.5 text-sm bg-black/40 hover:bg-white/10 transition col-span-2"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <div className="font-medium">Latency range (ms)</div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
            value={filters.latencyRange[0]}
            onChange={(e)=>onLatencyChange(0, Number(e.target.value))}
          />
          <span>to</span>
          <input
            type="number"
            className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
            value={filters.latencyRange[1]}
            onChange={(e)=>onLatencyChange(1, Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {presetRanges.map((r,i)=>(
            <button
              key={i}
              className="inline-flex items-center rounded-2xl border border-white/10 px-3 py-1.5 text-sm bg-black/40 hover:bg-white/10 transition"
              onClick={()=>setFilters({ latencyRange: [r[0], r[1]] })}
            >
              {r[0]}–{r[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {(['showRealtime','showHistorical','showRegions','showHeatmap'] as const).map(k => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4 accent-white/90" checked={filters[k]} onChange={()=>toggle(k)} />
            {k.replace('show','Show ')}
          </label>
        ))}
      </div>
    </div>
  );
}
