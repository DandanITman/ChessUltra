import React, { useMemo, useState } from 'react';

const API = 'http://localhost:3000';

export function QuickTest() {
  const [rookResp, setRookResp] = useState<any | null>(null);
  const [legalResp, setLegalResp] = useState<any | null>(null);
  const [file, setFile] = useState(3);
  const [rank, setRank] = useState(3);

  const rookUrl = useMemo(() => `${API}/rules/rook?file=${file}&rank=${rank}`, [file, rank]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Rules API Quick Test</h2>

      <section style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
        <h3>Rook moves</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>file: <input type="number" value={file} onChange={(e) => setFile(Number(e.target.value))} /></label>
          <label>rank: <input type="number" value={rank} onChange={(e) => setRank(Number(e.target.value))} /></label>
          <button onClick={async () => {
            const res = await fetch(rookUrl);
            setRookResp(await res.json());
          }}>Fetch</button>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{rookResp ? JSON.stringify(rookResp, null, 2) : 'No data yet'}</pre>
      </section>

      <section style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
        <h3>Simple legal moves</h3>
        <button onClick={async () => {
          const res = await fetch(`${API}/rules/legal`);
          setLegalResp(await res.json());
        }}>Fetch</button>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{legalResp ? JSON.stringify(legalResp, null, 2) : 'No data yet'}</pre>
      </section>
    </div>
  );
}

