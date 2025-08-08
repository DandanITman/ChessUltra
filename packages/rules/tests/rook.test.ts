import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import type { Piece, Square } from '../src/lib/types';

const R: Piece = { type: 'rook', color: 'white' };
const r: Piece = { type: 'rook', color: 'black' };

function sq(file: number, rank: number): Square {
  return { file, rank };
}

describe('rook moves', () => {
  it('generates moves on empty board', () => {
    const b = new Board();
    const from = sq(3, 3);
    b.set(from, R);
    const moves = b.rookMoves(from, 'white');
    // 7*2 directions? Actually rook has up to 14 moves in the middle (7+7)
    expect(moves.length).toBe(14);
  });

  it('stops at blocking friendly piece, includes capture on enemy', () => {
    const b = new Board();
    const from = sq(3, 3);
    b.set(from, R);
    b.set(sq(5, 3), R); // friendly blocks to the right
    b.set(sq(1, 3), r); // enemy to the left, capturable and blocks further

    const moves = b.rookMoves(from, 'white');
    const toSquares = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));

    // to the right: (4,3) only (since (5,3) is friendly block)
    expect(toSquares.has('4,3')).toBe(true);
    expect(toSquares.has('5,3')).toBe(false);

    // to the left: includes (2,3) and capture (1,3), but not beyond
    expect(toSquares.has('2,3')).toBe(true);
    expect(toSquares.has('1,3')).toBe(true); // capture
    expect(toSquares.has('0,3')).toBe(false);
  });
});

