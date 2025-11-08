import { CloudRegion } from '@/lib/types';

export const CLOUD_REGIONS: readonly CloudRegion[] = [
  { id:'aws-use1',      provider:'AWS',   name:'US East (N. Virginia)',    regionCode:'us-east-1',     lat:38.92, lng:-77.07 },
  { id:'aws-euw2',      provider:'AWS',   name:'EU (London)',              regionCode:'eu-west-2',     lat:51.50, lng:-0.12 },
  { id:'gcp-ew4',       provider:'GCP',   name:'Europe West 4 (NL)',       regionCode:'europe-west4',  lat:52.37, lng:4.90 },
  { id:'gcp-asia1',     provider:'GCP',   name:'Asia East 1 (Taiwan)',     regionCode:'asia-east1',    lat:25.03, lng:121.56 },
  { id:'az-eastasia',   provider:'AZURE', name:'East Asia (Hong Kong)',    regionCode:'eastasia',      lat:22.28, lng:114.15 },
  { id:'az-westeurope', provider:'AZURE', name:'West Europe (Netherlands)',regionCode:'westeurope',    lat:52.37, lng:4.90 },
] as const;
