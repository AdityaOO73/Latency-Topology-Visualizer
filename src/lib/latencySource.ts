import { EXCHANGES } from '@/data/exchanges';
import { CLOUD_REGIONS } from '@/data/cloudRegions';
import { useLatencyStore } from './latencyStore';
import type { Edge } from './types';

// ---------- common utils ----------
function haversineKm(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371;
  const toRad = (d:number) => (d*Math.PI)/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*sin2(dLon/2);
  return 2 * R * Math.asin(Math.sqrt(a));
  function sin2(x:number){ return Math.sin(x)*Math.sin(x); }
}

// ---------- synthetic ----------
function baseLatencyFromDistance(km: number) {
  const base = Math.max(5, km / 100 + 5);
  const jitter = (Math.random() - 0.5) * 10;
  return Math.max(3, base + jitter);
}

export function startSyntheticLatency() {
  // initialize edges
  const now = Date.now();
  const initial: Edge[] = [];
  for (const ex of EXCHANGES) {
    for (const rg of CLOUD_REGIONS) {
      const km = haversineKm(ex.lat, ex.lng, rg.lat, rg.lng);
      const ms = Math.round(baseLatencyFromDistance(km));
      initial.push({
        id: `${ex.id}->${rg.id}`,
        fromId: ex.id,
        toId: rg.id,
        lastMs: ms,
        history: [{ t: now, ms }]
      });
    }
  }
  useLatencyStore.getState().bulkUpsert(initial);

  // periodic updates (throttled)
  const handle = setInterval(() => {
    const state = useLatencyStore.getState();
    const nowT = Date.now();
    const updated: Edge[] = [];

    for (const e of Object.values(state.edges)) {
      const next = Math.max(3, Math.round(e.lastMs + (Math.random() - 0.5) * 8));
      const cutoff = nowT - 30 * 60 * 1000;
      const history = [...e.history, { t: nowT, ms: next }].filter(h => h.t >= cutoff);
      updated.push({ ...e, lastMs: next, history });
    }
    state.bulkUpsert(updated);
  }, 5000);

  return () => clearInterval(handle);
}

// ---------- API polling (optional) ----------
export function startApiPolling(endpoint = '/api/latency') {
  const controller = new AbortController();

  let backoff = 2000;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const tick = async () => {
    try {
      const res = await fetch(endpoint, { signal: controller.signal, cache:'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      const rows: { id: string; ms: number; t?: number }[] = await res.json();
      const nowT = Date.now();
      const updated: Edge[] = [];
      const state = useLatencyStore.getState();

      for (const row of rows) {
        const cur = state.edges[row.id];
        const t = row.t ?? nowT;
        const history = cur ? [...cur.history, { t, ms: row.ms }] : [{ t, ms: row.ms }];
        const cutoff = nowT - 30 * 60 * 1000;
        const trimmed = history.filter(h => h.t >= cutoff);
        updated.push(cur ? { ...cur, lastMs: row.ms, history: trimmed } : {
          id: row.id,
          fromId: row.id.split('->')[0],
          toId: row.id.split('->')[1],
          lastMs: row.ms,
          history: trimmed
        });
      }
      state.bulkUpsert(updated);
      backoff = 2000; // reset on success
    } catch {
      // expo backoff up to 60s
      backoff = Math.min(backoff * 2, 60000);
    } finally {
      timer = setTimeout(tick, backoff);
    }
  };

if ('requestIdleCallback' in window) {
  (window).requestIdleCallback(tick);
} else {
  setTimeout(tick, 0);
}


  return () => {
    controller.abort();
    if (timer) clearTimeout(timer);
  };
}
