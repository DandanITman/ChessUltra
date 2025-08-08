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

  private rayMoves(from: Square, color: Color, deltas: Array<[number, number]>): Move[] {
    const res: Move[] = [];
    for (const [dx, dy] of deltas) {
      let x = from.file + dx;
      let y = from.rank + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const to: Square = { file: x, rank: y };
        const occ = this.get(to);
        if (occ) {
          if (occ.color !== color) res.push({ from, to });
          break;
        } else {
          res.push({ from, to });
        }
        x += dx;
        y += dy;
      }
    }
    return res;
  }

  rookMoves(from: Square, color: Color): Move[] {
    return this.rayMoves(from, color, [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]);
  }

  bishopMoves(from: Square, color: Color): Move[] {
    return this.rayMoves(from, color, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
  }

  queenMoves(from: Square, color: Color): Move[] {
    return [
      ...this.rookMoves(from, color),
      ...this.bishopMoves(from, color),
    ];
  }

  knightMoves(from: Square, color: Color): Move[] {
    const res: Move[] = [];
    const jumps: Array<[number, number]> = [
      [1, 2], [2, 1], [2, -1], [1, -2],
      [-1, -2], [-2, -1], [-2, 1], [-1, 2],
    ];
    for (const [dx, dy] of jumps) {
      const to: Square = { file: from.file + dx, rank: from.rank + dy };
      if (!this.inBounds(to)) continue;
      const occ = this.get(to);
      if (!occ || occ.color !== color) res.push({ from, to });
    }
    return res;
  }

  kingMoves(from: Square, color: Color): Move[] {
    const res: Move[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const to: Square = { file: from.file + dx, rank: from.rank + dy };
        if (!this.inBounds(to)) continue;
        const occ = this.get(to);
        if (!occ || occ.color !== color) res.push({ from, to });
      }
    }
    // Castling will be handled in a higher-level legality layer later
    return res;
  }
}

