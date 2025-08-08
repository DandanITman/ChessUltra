import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import { applyMove, initialRulesState } from '../src/lib/state';
import { legalMoves } from '../src/lib/legal';
import type { Piece, Square } from '../src/lib/types';

const K: Piece = { type: 'king', color: 'white' };
const k: Piece = { type: 'king', color: 'black' };
const R: Piece = { type: 'rook', color: 'white' };
const r: Piece = { type: 'rook', color: 'black' };
const P: Piece = { type: 'pawn', color: 'white' };
const p: Piece = { type: 'pawn', color: 'black' };

function sq(file: number, rank: number): Square { return { file, rank }; }

describe('state applyMove', () => {
  it('updates enPassantTarget after double push', () => {
    const b = new Board();
    b.set(sq(0, 1), P);
    b.set(sq(4, 0), K);
    const st = initialRulesState();
    const moves = legalMoves(b, st, sq(0, 1), 'white');
    const dbl = moves.find(m => m.to.file === 0 && m.to.rank === 3)!;
    const res = applyMove(b, st, dbl);
    expect(res.state.enPassantTarget).toEqual(sq(0, 2));
  });

  it('updates castling rights when king or rook moves', () => {
    const b = new Board();
    b.set(sq(4, 0), K);
    b.set(sq(7, 0), R);
    let st = initialRulesState();
    // move rook a bit
    const rmove = { from: sq(7, 0), to: sq(6, 0) } as const;
    let out = applyMove(b, st, rmove);
    expect(out.state.castling.white.K).toBe(false);
    expect(out.state.castling.white.Q).toBe(true);

    // move king
    const kmove = { from: sq(4, 0), to: sq(5, 0) } as const;
    out = applyMove(out.board, out.state, kmove);
    expect(out.state.castling.white.K).toBe(false);
    expect(out.state.castling.white.Q).toBe(false);
  });

  it('handles promotions when provided', () => {
    const b = new Board();
    b.set(sq(0, 6), P);
    b.set(sq(4, 7), k);
    b.set(sq(4, 0), K);
    const st = initialRulesState();
    const move = { from: sq(0, 6), to: sq(0, 7), promotion: 'queen' } as const;
    const res = applyMove(b, st, move);
    expect(res.board.get(sq(0, 7))).toEqual({ type: 'queen', color: 'white' });
  });
});

