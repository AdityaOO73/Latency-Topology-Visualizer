export type CloudProvider = 'AWS' | 'GCP' | 'AZURE';

export interface Exchange {
  readonly id: string;
  readonly name: string;
  readonly provider: CloudProvider;
  readonly lat: number;
  readonly lng: number;
  readonly regionCode: string;
}

export interface CloudRegion {
  readonly id: string;
  readonly provider: CloudProvider;
  readonly name: string;
  readonly regionCode: string;
  readonly lat: number;
  readonly lng: number;
}

export interface EdgeSample {
  readonly t: number; 
  readonly ms: number;
}

export interface Edge {
  readonly id: string;      
  readonly fromId: string;    
  readonly toId: string;      
  lastMs: number;
  history: EdgeSample[];    
}

export type Filters = {
  providers: Readonly<Record<CloudProvider, boolean>>;
  exchanges: readonly string[];           
  latencyRange: readonly [number, number]; 
  showRealtime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
  showHeatmap: boolean;
  search: string;
};

export type LatencySource = 'synthetic' | 'api';
