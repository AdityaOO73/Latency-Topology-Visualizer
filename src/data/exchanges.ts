import { Exchange } from '@/lib/types';

export const EXCHANGES: readonly Exchange[] = [
  { id:'binance-ldn', name:'Binance (London)',      provider:'AWS',   lat:51.5072, lng:-0.1276,  regionCode:'eu-west-2' },
  { id:'okx-hkg',     name:'OKX (Hong Kong)',       provider:'AZURE', lat:22.3193, lng:114.1694, regionCode:'eastasia' },
  { id:'bybit-sgp',   name:'Bybit (Singapore)',     provider:'AWS',   lat:1.3521,  lng:103.8198, regionCode:'ap-southeast-1' },
  { id:'deribit-ams', name:'Deribit (Amsterdam)',   provider:'GCP',   lat:52.3676, lng:4.9041,   regionCode:'europe-west4' },
] as const;
