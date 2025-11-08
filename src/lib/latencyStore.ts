import { create } from 'zustand';
import { Edge, Filters, LatencySource } from './types';

type State = {
  edges: Record<string, Edge>;
  filters: Filters;
  source: LatencySource;
  setFilters: (p: Partial<Filters>) => void;
  setSource: (s: LatencySource) => void;
  upsertEdge: (edge: Edge) => void;
  bulkUpsert: (edges: Edge[]) => void;
  clear: () => void;
};

const defaultFilters: Filters = {
  providers: { AWS:true, GCP:true, AZURE:true },
  exchanges: [],
  latencyRange: [0, 300],
  showRealtime: true,
  showHistorical: true,
  showRegions: true,
  showHeatmap: false,
  search: ''
};

export const useLatencyStore = create<State>((set) => ({
  edges: {},
  filters: defaultFilters,
  source: 'synthetic',
  setFilters: (p) => set((s) => ({ filters: { ...s.filters, ...p }})),
  setSource: (source) => set({ source }),
  upsertEdge: (edge) => set((s) => ({ edges: { ...s.edges, [edge.id]: edge } })),
  bulkUpsert: (edges) => set((s) => {
    const next = { ...s.edges };
    for (const e of edges) next[e.id] = e;
    return { edges: next };
  }),
  clear: () => set({ edges: {} })
}));

export const selectEdges = (s: State) => s.edges;
export const selectFilters = (s: State) => s.filters;
export const selectSource = (s: State) => s.source;
