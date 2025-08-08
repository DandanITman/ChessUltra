import React from 'react';

import { QuickTest } from './QuickTest';
import { BoardUI } from './BoardUI';

export function App() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 24 }}>
      <div style={{ textAlign: 'left', width: 'min(100%, 900px)', display: 'grid', gap: 24 }}>
        <h1>♟️ ChessUltra</h1>
        <p>Web client scaffold is live. Quick Rules API tester below.</p>
        <QuickTest />
        <hr />
        <BoardUI />
      </div>
    </div>
  );
}

