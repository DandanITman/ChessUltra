import type { BoardArray, Color, Move, Piece, Square } from './types';

export class Board {
  private grid: BoardArray;

  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
  }

  static fromPosition(pieces: Array<{ sq: Square; piece: Piece }>): Board {
    const b = new Board();
    for (const { sq, piece } of pieces) b.set(sq, piece);
    return b;
  }

  get(sq: Square): Piece | null {
    if (!this.inBounds(sq)) return null;
    return this.grid[sq.rank][sq.file];
  }

  set(sq: Square, piece: Piece | null): void {
    if (!this.inBounds(sq)) throw new Error('Out of bounds');
    this.grid[sq.rank][sq.file] = piece;
  }

  inBounds(sq: Square): boolean {
    return sq.file >= 0 && sq.file < 8 && sq.rank >= 0 && sq.rank < 8;
  }

  rookMoves(from: Square, color: Color): Move[] {
    const res: Move[] = [];
    const deltas: Array<[number, number]> = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const [dx, dy] of deltas) {
      let x = from.file + dx;
      let y = from.rank + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const to: Square = { file: x, rank: y };
        const occ = this.get(to);
        if (occ) {
          if (occ.color !== color) res.push({ from, to }); // capture
          break; // blocked
        } else {
          res.push({ from, to });
        }
        x += dx;
        y += dy;
      }
    }

    return res;
  }
}

