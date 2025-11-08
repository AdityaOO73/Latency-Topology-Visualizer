'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import { EXCHANGES } from '@/data/exchanges';
import { CLOUD_REGIONS } from '@/data/cloudRegions';
import { providerColor, latencyColor } from '@/lib/colors';
import {
  useLatencyStore,
  selectEdges,
  selectFilters,
  selectSource
} from '@/lib/latencyStore';
import { startSyntheticLatency, startApiPolling } from '@/lib/latencySource';
import type { Edge } from '@/lib/types';
import type { GlobeMethods } from 'react-globe.gl';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

type Props = { onSelectEdge?: (id: string) => void };

type ExchangePoint = (typeof EXCHANGES)[number];
type RegionPoint   = (typeof CLOUD_REGIONS)[number];

type ArcDatum = {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  ms: number;
};

export default function GlobeScene({ onSelectEdge }: Props) {
  const edges   = useLatencyStore(selectEdges);
  const filters = useLatencyStore(selectFilters);
  const source  = useLatencyStore(selectSource);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    let stop: (() => void) | undefined;

    const boot = () => {
      stop = source === 'api' ? startApiPolling('/api/latency') : startSyntheticLatency();
    };

    if ('requestIdleCallback' in window) {
      (window).requestIdleCallback(boot);
    } else {
      setTimeout(boot, 0);
    }

    return () => stop?.();
  }, [source]);

  useEffect(() => {
    const r = globeRef.current?.renderer?.();
    if (!r) return;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }, []);

  const filteredExchanges: ExchangePoint[] = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return EXCHANGES.filter(
      e =>
        filters.providers[e.provider] &&
        (filters.exchanges.length ? filters.exchanges.includes(e.id) : true) &&
        (!q || e.name.toLowerCase().includes(q))
    );
  }, [filters]);

  const filteredRegions: RegionPoint[] = useMemo(
    () => CLOUD_REGIONS.filter(r => filters.providers[r.provider]),
    [filters]
  );

  const arcData: ArcDatum[] = useMemo(() => {
    const all: Edge[] = Object.values(edges);
    return all
      .filter(e => {
        const ex = EXCHANGES.find(x => x.id === e.fromId);
        const rg = CLOUD_REGIONS.find(x => x.id === e.toId);
        if (!ex || !rg) return false;
        return (
          filters.providers[ex.provider] &&
          filters.providers[rg.provider] &&
          (filters.exchanges.length ? filters.exchanges.includes(ex.id) : true) &&
          e.lastMs >= filters.latencyRange[0] &&
          e.lastMs <= filters.latencyRange[1]
        );
      })
      .slice(0, 800)
      .map(e => {
        const ex = EXCHANGES.find(x => x.id === e.fromId)!;
        const rg = CLOUD_REGIONS.find(x => x.id === e.toId)!;
        return {
          id: e.id,
          startLat: ex.lat,
          startLng: ex.lng,
          endLat: rg.lat,
          endLng: rg.lng,
          color: latencyColor(e.lastMs),
          ms: e.lastMs
        };
      });
  }, [edges, filters]);

  const pointColor = (obj: object) => providerColor[(obj as ExchangePoint).provider];
  const pointLabel = (obj: object) => {
    const d = obj as ExchangePoint;
    return `${d.name}\n${d.provider} • ${d.regionCode}`;
  };
  const labelText  = (obj: object) => (obj as RegionPoint).regionCode;
  const labelColor = () => 'white';
  const arcColor   = (obj: object) => (obj as ArcDatum).color;

  const handleArcClick = (
    arc: object,
    // _evt: MouseEvent,
    // _coords: { lat: number; lng: number; altitude: number }
  ) => {
    onSelectEdge?.((arc as ArcDatum).id);
  };

  return (
    <div className="relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden bg-black">
      <Globe
        ref={globeRef}
        height={540}
        backgroundColor="#000000"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere={false}
        pointsData={filteredExchanges as unknown as object[]}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointColor={pointColor}
        pointLabel={pointLabel}
        pointResolution={6}
        labelsData={(filters.showRegions ? filteredRegions : []) as unknown as object[]}
        labelLat="lat"
        labelLng="lng"
        labelText={labelText}
        labelSize={0.8}
        labelColor={labelColor}
        labelDotRadius={0.2}
        labelAltitude={0.01}
        arcsData={(filters.showRealtime ? arcData : []) as unknown as object[]}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcStroke={1.25}
        arcColor={arcColor}
        arcDashLength={0.45}
        arcDashGap={0.12}
        arcDashAnimateTime={2000}
        onArcClick={handleArcClick}
      />

      <div className="absolute top-3 left-3 space-y-2 pointer-events-none">
        <div className="px-3 py-1 rounded bg-black/60 text-white text-sm inline-block pointer-events-auto">
          Arcs: {arcData.length}
        </div>
      </div>
    </div>
  );
}
