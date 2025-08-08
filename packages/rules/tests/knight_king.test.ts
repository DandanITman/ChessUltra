import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import type { Piece, Square } from '../src/lib/types';

const Nw: Piece = { type: 'knight', color: 'white' };
const Nb: Piece = { type: 'knight', color: 'black' };
const Kw: Piece = { type: 'king', color: 'white' };
const B: Piece = { type: 'bishop', color: 'white' };
const b: Piece = { type: 'bishop', color: 'black' };

function sq(file: number, rank: number): Square {
  return { file, rank };
}

describe('knight and king moves', () => {
  it('knight hops ignore blockers and can capture enemies', () => {
    const board = new Board();
    const from = sq(3, 3);
    board.set(from, Nw);
    board.set(sq(3, 4), B); // blocker in between, should be ignored
    board.set(sq(5, 4), b); // enemy on a knight target

    const moves = board.knightMoves(from, 'white');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));

    // All 8 potential targets in center but bounded by board: from (3,3) there are 8
    expect(moves.length).toBe(8);
    // Ensure capture square included
    expect(set.has('5,4')).toBe(true);
    // Ensure a typical knight target is included
    expect(set.has('4,5')).toBe(true);
  });

  it('king moves 1 step and respects blocks/captures', () => {
    const board = new Board();
    const from = sq(0, 0);
    board.set(from, Kw);
    board.set(sq(1, 1), B); // friendly block
    board.set(sq(0, 1), b); // enemy capture

    const moves = board.kingMoves(from, 'white');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));

    // From corner, king has up to 3 legal squares
    expect(set.has('1,1')).toBe(false); // blocked by friendly
    expect(set.has('0,1')).toBe(true); // capture
    expect(set.has('1,0')).toBe(true); // empty
  });
});

