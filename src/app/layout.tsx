import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer',
  description: '3D latency map for exchanges & cloud regions',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
