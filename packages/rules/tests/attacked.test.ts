import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import type { Piece, Square } from '../src/lib/types';

const Rw: Piece = { type: 'rook', color: 'white' };
const Rb: Piece = { type: 'rook', color: 'black' };
const Bb: Piece = { type: 'bishop', color: 'black' };
const Nw: Piece = { type: 'knight', color: 'white' };
const Pw: Piece = { type: 'pawn', color: 'white' };

function sq(file: number, rank: number): Square {
  return { file, rank };
}

describe('isSquareAttacked', () => {
  it('detects rook/queen orthogonal attacks with blocking', () => {
    const b = new Board();
    b.set(sq(0, 0), Rw);
    const t = sq(0, 3);
    expect(b.isSquareAttacked(t, 'white')).toBe(true);
    // block with non-attacking friendly piece on the line
    b.set(sq(0, 2), Nw);
    expect(b.isSquareAttacked(t, 'white')).toBe(false);
  });

  it('detects bishop/queen diagonal attacks with blocking', () => {
    const b = new Board();
    b.set(sq(1, 1), Bb);
    const t = sq(3, 3);
    expect(b.isSquareAttacked(t, 'black')).toBe(true);
    // block with a non-diagonal attacker (rook) on the line
    b.set(sq(2, 2), Rb);
    expect(b.isSquareAttacked(t, 'black')).toBe(false);
  });

  it('detects pawn attack directionality', () => {
    const b = new Board();
    b.set(sq(3, 3), Pw);
    expect(b.isSquareAttacked(sq(4, 4), 'white')).toBe(true);
    expect(b.isSquareAttacked(sq(2, 4), 'white')).toBe(true);
    expect(b.isSquareAttacked(sq(3, 4), 'white')).toBe(false);
  });
});

