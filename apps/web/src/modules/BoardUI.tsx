import React, { useCallback, useEffect, useMemo, useState } from 'react';

const API = 'http://localhost:3000';

type Color = 'white' | 'black';
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

type Piece = { file: number; rank: number; type: PieceType; color: Color };

type RulesState = {
  castling: { white: { K: boolean; Q: boolean }; black: { K: boolean; Q: boolean } };
  enPassantTarget: { file: number; rank: number } | null;
  halfmoveClock: number;
  fullmoveNumber: number;
};

type Move = { from: { file: number; rank: number }; to: { file: number; rank: number }; promotion?: PieceType; flags?: string[] };

const pieceSymbol: Record<PieceType, { white: string; black: string }> = {
  king:   { white: '♔', black: '♚' },
  queen:  { white: '♕', black: '♛' },
  rook:   { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn:   { white: '♙', black: '♟' },
};

function defaultState(): RulesState {
  return {
    castling: { white: { K: true, Q: true }, black: { K: true, Q: true } },
    enPassantTarget: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
  };
}

function startingSample(): Piece[] {
  const pieces: Piece[] = [];
  // kings
  pieces.push({ file: 4, rank: 0, type: 'king', color: 'white' });
  pieces.push({ file: 4, rank: 7, type: 'king', color: 'black' });
  // a few pawns for fun
  pieces.push({ file: 0, rank: 1, type: 'pawn', color: 'white' });
  pieces.push({ file: 4, rank: 6, type: 'pawn', color: 'black' });
  return pieces;
}

export function BoardUI() {
  const [pieces, setPieces] = useState<Piece[]>(startingSample);
  const [state, setState] = useState<RulesState>(defaultState);
  const [sideToMove, setSideToMove] = useState<Color>('white');
  const [selected, setSelected] = useState<{ file: number; rank: number } | null>(null);
  const [dragFrom, setDragFrom] = useState<{ file: number; rank: number } | null>(null);
  const [legalTargets, setLegalTargets] = useState<{ file: number; rank: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pieceAt = useCallback((f: number, r: number) => pieces.find(p => p.file === f && p.rank === r), [pieces]);

  const boardSquares = useMemo(() => {
    const arr: { file: number; rank: number }[] = [];
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        arr.push({ file, rank });
      }
    }
    return arr;
  }, []);

  const fetchLegal = useCallback(async (from: { file: number; rank: number }, color: Color) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/rules/legal`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pieces, from, color, state }),
      });
      const json = await res.json();
      const targets = (json.moves ?? []).map((m: any) => m.to) as { file: number; rank: number }[];
      setLegalTargets(targets);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch legal moves');
    } finally { setLoading(false); }
  }, [pieces, state]);

  const apply = useCallback(async (move: Move) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/rules/apply`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pieces, move, state }),
      });
      const json = await res.json();
      setPieces(json.pieces);
      setState(json.state);
      setSelected(null);
      setLegalTargets([]);
      setSideToMove(prev => (prev === 'white' ? 'black' : 'white'));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to apply move');
    } finally { setLoading(false); }
  }, [pieces, state]);

  const onSquareClick = useCallback((sq: { file: number; rank: number }) => {
    const piece = pieceAt(sq.file, sq.rank);
    if (selected && legalTargets.some(t => t.file === sq.file && t.rank === sq.rank)) {
      const move: Move = { from: selected, to: sq };
      const moving = pieceAt(selected.file, selected.rank);
      if (moving?.type === 'pawn' && (sq.rank === 7 || sq.rank === 0)) move.promotion = 'queen';
      void apply(move);
      return;
    }

    if (piece && piece.color === sideToMove) {
      setSelected(sq);
      setDragFrom(sq);
      void fetchLegal(sq, sideToMove);
    } else {
      setSelected(null);
      setDragFrom(null);
      setLegalTargets([]);
    }
  }, [apply, fetchLegal, legalTargets, pieceAt, selected, sideToMove]);

  const reset = useCallback(() => {
    setPieces(startingSample());
    setState(defaultState());
    setSelected(null);
    setLegalTargets([]);
    setSideToMove('white');
    setError(null);
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Board UI</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div>Side to move: <b>{sideToMove}</b></div>
        <button onClick={reset}>Reset sample</button>
        {loading && <span>Loading…</span>}
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 56px)', gridAutoRows: '56px', border: '2px solid #333' }}>
        {boardSquares.map((sq, idx) => {
          const dark = (sq.file + sq.rank) % 2 === 1;
          const p = pieceAt(sq.file, sq.rank);
          const isSel = selected && selected.file === sq.file && selected.rank === sq.rank;
          const isTarget = legalTargets.some(t => t.file === sq.file && t.rank === sq.rank);
          const isCapture = isTarget && !!p; // target occupied by opponent
          return (
            <div
              key={`${sq.file},${sq.rank}`}
              onClick={() => onSquareClick(sq)}
              onDragOver={(e) => { if (dragFrom) e.preventDefault(); }}
              onDrop={(e) => {
                if (!dragFrom) return;
                if (!legalTargets.some(t => t.file === sq.file && t.rank === sq.rank)) return;
                const move: Move = { from: dragFrom, to: sq };
                const moving = pieceAt(dragFrom.file, dragFrom.rank);
                if (moving?.type === 'pawn' && (sq.rank === 7 || sq.rank === 0)) move.promotion = 'queen';
                void apply(move);
              }}
              style={{
                width: 56, height: 56, cursor: dragFrom ? 'copy' : 'pointer',
                background: isSel ? '#f7d674' : isTarget ? (isCapture ? '#fca5a5' : '#86efac') : dark ? '#769656' : '#eeeed2',
                color: dark ? '#fff' : '#111', display: 'grid', placeItems: 'center', fontSize: 28,
                userSelect: 'none', position: 'relative',
              }}
              title={`(${sq.file},${sq.rank})`}
            >
              {/* legal move marker */}
              {isTarget && !p && (
                <span style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#065f46' }} />
              )}
              {p ? (
                <span
                  draggable={p.color === sideToMove}
                  onDragStart={() => {
                    if (p.color !== sideToMove) return;
                    setDragFrom({ file: sq.file, rank: sq.rank });
                    setSelected({ file: sq.file, rank: sq.rank });
                    void fetchLegal({ file: sq.file, rank: sq.rank }, sideToMove);
                  }}
                  onDragEnd={() => {
                    setDragFrom(null);
                    setSelected(null);
                    setLegalTargets([]);
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {pieceSymbol[p.type][p.color]}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <small style={{ opacity: 0.7 }}>Tip: Click or drag your piece to see legal moves; green = quiet move, red = capture. Pawns auto-promote to queens for now.</small>
    </div>
  );
}

