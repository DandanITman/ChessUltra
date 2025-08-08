import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import { legalMoves } from '../src/lib/legal';
import type { RulesState, Piece, Square } from '../src/lib/types';

const K: Piece = { type: 'king', color: 'white' };
const k: Piece = { type: 'king', color: 'black' };
const R: Piece = { type: 'rook', color: 'white' };
const r: Piece = { type: 'rook', color: 'black' };
const P: Piece = { type: 'pawn', color: 'white' };
const p: Piece = { type: 'pawn', color: 'black' };

function state(init?: Partial<RulesState>): RulesState {
  return {
    castling: { white: { K: true, Q: true }, black: { K: true, Q: true } },
    enPassantTarget: null,
    ...init,
  };
}

function sq(file: number, rank: number): Square { return { file, rank }; }

describe('legalMoves', () => {
  it('filters out moves that leave king in check', () => {
    const b = new Board();
    b.set(sq(4, 0), K);
    b.set(sq(4, 7), k);
    // put a checking rook on same file
    b.set(sq(4, 5), r);
    // place a white rook to interpose
    b.set(sq(4, 1), R);

    const moves = legalMoves(b, state(), sq(4, 1), 'white');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));
    expect(set.has('4,2')).toBe(true);
    expect(set.has('4,3')).toBe(true);
    expect(set.has('4,4')).toBe(true);
    // moving off file would be illegal because king remains in check
    expect(set.has('5,1')).toBe(false);
  });

  it('generates king-side castling when path is clear and safe', () => {
    const b = new Board();
    b.set(sq(4, 0), K);
    b.set(sq(7, 0), R);
    // path clear (5,0) and (6,0)
    const moves = legalMoves(b, state(), sq(4, 0), 'white');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));
    expect(set.has('6,0')).toBe(true);
  });

  it('generates en passant when target is set and capture square empty', () => {
    const b = new Board();
    // ensure a king exists for legality checks
    b.set(sq(0, 0), K);
    // white pawn on (4,4), black pawn just moved 2 from (5,6) to (5,4), so enPassantTarget=(5,5)
    b.set(sq(4, 4), P);
    b.set(sq(5, 4), p);
    const st = state({ enPassantTarget: sq(5, 5) });
    const moves = legalMoves(b, st, sq(4, 4), 'white');
    const hasEP = moves.some((m) => m.flags?.includes('enPassant'));
    expect(hasEP).toBe(true);
  });
});

