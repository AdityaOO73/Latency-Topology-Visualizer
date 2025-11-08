export function exportCsv(filename: string, rows: { id:string; ms:number; t:number }[]) {
  const header = 'id,ms,t\n';
  const body = rows.map(r => `${r.id},${r.ms},${new Date(r.t).toISOString()}`).join('\n');
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
