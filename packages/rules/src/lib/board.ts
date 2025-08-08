import type { BoardArray, Color, Move, Piece, Square, RulesState } from './types';

export class Board {
  private grid: BoardArray;

  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
  }

  clone(): Board {
    const b = new Board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = this.grid[r][f];
        if (p) b.grid[r][f] = { ...p };
      }
    }
    return b;
  }

  isSquareAttacked(target: Square, byColor: Color): boolean {
    // Knights
    const knightDeltas: Array<[number, number]> = [
      [1, 2], [2, 1], [2, -1], [1, -2],
      [-1, -2], [-2, -1], [-2, 1], [-1, 2],
    ];
    for (const [dx, dy] of knightDeltas) {
      const sq: Square = { file: target.file + dx, rank: target.rank + dy };
      const p = this.get(sq);
      if (p && p.color === byColor && p.type === 'knight') return true;
    }

    // King (adjacent)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const sq: Square = { file: target.file + dx, rank: target.rank + dy };
        const p = this.get(sq);
        if (p && p.color === byColor && p.type === 'king') return true;
      }
    }

    // Pawns: attacks are forward-diagonals from the pawn perspective
    const pawnDir = byColor === 'white' ? 1 : -1;
    for (const dx of [-1, 1] as const) {
      const psq: Square = { file: target.file - dx, rank: target.rank - pawnDir };
      const p = this.get(psq);
      if (p && p.color === byColor && p.type === 'pawn') return true;
    }

    // Sliding pieces: rook/queen (orthogonal)
    const ortho: Array<[number, number]> = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx, dy] of ortho) {
      let x = target.file + dx, y = target.rank + dy;
      while (x>=0 && x<8 && y>=0 && y<8) {
        const p = this.get({ file: x, rank: y });
        if (p) {
          if (p.color === byColor && (p.type === 'rook' || p.type === 'queen')) return true;
          break;
        }
        x += dx; y += dy;
      }
    }

    // Sliding pieces: bishop/queen (diagonals)
    const diag: Array<[number, number]> = [[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [dx, dy] of diag) {
      let x = target.file + dx, y = target.rank + dy;
      while (x>=0 && x<8 && y>=0 && y<8) {
        const p = this.get({ file: x, rank: y });
        if (p) {
          if (p.color === byColor && (p.type === 'bishop' || p.type === 'queen')) return true;
          break;
        }
        x += dx; y += dy;
      }
    }

    return false;
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

  movePiece(m: Move): void {
    const piece = this.get(m.from);
    if (!piece) throw new Error('No piece at from');
    // Handle en passant capture removal
    if (m.flags?.includes('enPassant')) {
      const dir = piece.color === 'white' ? 1 : -1;
      this.set({ file: m.to.file, rank: m.to.rank - dir }, null);
    }
    this.set(m.from, null);
    this.set(m.to, piece);
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

  pawnMoves(from: Square, color: Color): Move[] {
    const res: Move[] = [];
    const dir = color === 'white' ? 1 : -1; // rank increases up the board for white
    const startRank = color === 'white' ? 1 : 6;

    // single push
    const one: Square = { file: from.file, rank: from.rank + dir };
    if (this.inBounds(one) && !this.get(one)) {
      res.push({ from, to: one });
      // double push
      const two: Square = { file: from.file, rank: from.rank + 2 * dir };
      if (from.rank === startRank && this.inBounds(two) && !this.get(two)) {
        res.push({ from, to: two });
      }
    }

    // captures
    for (const dx of [-1, 1] as const) {
      const cap: Square = { file: from.file + dx, rank: from.rank + dir };
      if (!this.inBounds(cap)) continue;
      const occ = this.get(cap);
      if (occ && occ.color !== color) res.push({ from, to: cap });
    }

    // Promotion and en passant handled later
    return res;
  }
}

