import React from 'react';

import { QuickTest } from './QuickTest';

export function App() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 24 }}>
      <div style={{ textAlign: 'left', width: 'min(100%, 900px)' }}>
        <h1>♟️ ChessUltra</h1>
        <p>Web client scaffold is live. Quick Rules API tester below.</p>
        <QuickTest />
      </div>
    </div>
  );
}

