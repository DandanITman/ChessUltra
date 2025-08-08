import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import type { Piece, Square } from '../src/lib/types';

const Pw: Piece = { type: 'pawn', color: 'white' };
const Pb: Piece = { type: 'pawn', color: 'black' };
const Ew: Piece = { type: 'rook', color: 'white' };
const Eb: Piece = { type: 'rook', color: 'black' };

function sq(file: number, rank: number): Square {
  return { file, rank };
}

describe('pawn moves', () => {
  it('white pawn single and double push and captures', () => {
    const b = new Board();
    const from = sq(4, 1);
    b.set(from, Pw);

    // blocking single prevents double
    b.set(sq(4, 2), Ew);

    let moves = b.pawnMoves(from, 'white');
    let set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));
    expect(set.has('4,2')).toBe(false);
    expect(set.has('4,3')).toBe(false);

    // unblock and add enemy to capture
    b.set(sq(4, 2), null);
    b.set(sq(5, 2), Eb);
    moves = b.pawnMoves(from, 'white');
    set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));
    expect(set.has('4,2')).toBe(true);
    expect(set.has('4,3')).toBe(true); // double from start
    expect(set.has('5,2')).toBe(true); // capture
  });

  it('black pawn moves downward and captures diagonally', () => {
    const b = new Board();
    const from = sq(3, 6);
    b.set(from, Pb);
    b.set(sq(2, 5), Ew);

    const moves = b.pawnMoves(from, 'black');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));
    expect(set.has('3,5')).toBe(true);
    expect(set.has('3,4')).toBe(true);
    expect(set.has('2,5')).toBe(true);
  });
});

