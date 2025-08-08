import { describe, it, expect } from 'vitest';
import { Board } from '../src/lib/board';
import type { Piece, Square } from '../src/lib/types';

const B: Piece = { type: 'bishop', color: 'white' };
const Q: Piece = { type: 'queen', color: 'white' };
const b: Piece = { type: 'bishop', color: 'black' };

function sq(file: number, rank: number): Square {
  return { file, rank };
}

describe('bishop and queen moves', () => {
  it('bishop generates 13 moves from center on empty board', () => {
    const board = new Board();
    const from = sq(3, 3);
    board.set(from, B);
    const moves = board.bishopMoves(from, 'white');
    expect(moves.length).toBe(13); // 7 + 7 - 1? Actually diagonals sum to 13 from center
  });

  it('queen generates rook+bishop moves count from center on empty board', () => {
    const board = new Board();
    const from = sq(3, 3);
    board.set(from, Q);
    const q = board.queenMoves(from, 'white');
    const r = board.rookMoves(from, 'white');
    const bMoves = board.bishopMoves(from, 'white');
    expect(q.length).toBe(r.length + bMoves.length);
  });

  it('bishop stops at blocks and can capture enemy', () => {
    const board = new Board();
    const from = sq(3, 3);
    board.set(from, B);
    board.set(sq(5, 5), B); // friendly block on up-right diagonal
    board.set(sq(1, 5), b); // enemy block on up-left diagonal

    const moves = board.bishopMoves(from, 'white');
    const set = new Set(moves.map((m) => `${m.to.file},${m.to.rank}`));

    // Up-right: can go to (4,4) only, not (5,5)
    expect(set.has('4,4')).toBe(true);
    expect(set.has('5,5')).toBe(false);

    // Up-left: can go to (2,4) and capture (1,5) but not beyond (0,6)
    expect(set.has('2,4')).toBe(true);
    expect(set.has('1,5')).toBe(true);
    expect(set.has('0,6')).toBe(false);
  });
});

