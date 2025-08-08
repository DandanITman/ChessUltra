export type Color = 'white' | 'black';

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  file: number; // 0..7 (a..h)
  rank: number; // 0..7 (1..8), 0 is white's back rank
}

export type BoardArray = (Piece | null)[][]; // [rank][file]

export type MoveFlag = 'capture' | 'enPassant' | 'castleK' | 'castleQ' | 'promotion';

export interface Move {
  from: Square;
  to: Square;
  promotion?: PieceType;
  flags?: MoveFlag[];
}

export interface CastlingSideRights { K: boolean; Q: boolean }
export interface CastlingRights { white: CastlingSideRights; black: CastlingSideRights }

export interface RulesState {
  castling: CastlingRights;
  enPassantTarget: Square | null;
}

