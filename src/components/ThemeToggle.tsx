'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(()=> { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  return (
    <button
      onClick={()=>setDark(d=>!d)}
      className="inline-flex items-center rounded-2xl border border-white/10 px-3 py-1.5 text-sm font-medium bg-black/40 hover:bg-white/10 transition"
      title="Toggle theme"
    >
      {dark ? ' Dark' : ' Light'}
    </button>
  );
}
