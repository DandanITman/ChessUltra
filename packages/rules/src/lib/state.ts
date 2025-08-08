import type { Color, Move, Piece, RulesState, Square } from './types';
import { Board } from './board';

export function initialRulesState(): RulesState {
  return {
    castling: { white: { K: true, Q: true }, black: { K: true, Q: true } },
    enPassantTarget: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
  };
}

function isPawnDoublePush(piece: Piece, from: Square, to: Square): boolean {
  const dir = piece.color === 'white' ? 1 : -1;
  const startRank = piece.color === 'white' ? 1 : 6;
  return piece.type === 'pawn' && from.file === to.file && from.rank === startRank && to.rank === from.rank + 2 * dir;
}

export interface ApplyResult {
  board: Board;
  state: RulesState;
  captured?: Piece | null;
}

export function applyMove(board: Board, state: RulesState, move: Move): ApplyResult {
  const piece = board.get(move.from);
  if (!piece) throw new Error('No piece on from');

  const next = board.clone();
  let captured: Piece | null = null;

  // Handle en-passant capture
  if (move.flags?.includes('enPassant')) {
    const dir = piece.color === 'white' ? 1 : -1;
    const capSq: Square = { file: move.to.file, rank: move.to.rank - dir };
    captured = next.get(capSq);
    next.set(capSq, null);
  } else {
    captured = next.get(move.to);
  }

  // Move piece
  next.set(move.from, null);

  // Promotion
  let movedPiece: Piece = piece;
  if (move.promotion && piece.type === 'pawn') {
    movedPiece = { type: move.promotion, color: piece.color };
  }
  next.set(move.to, movedPiece);

  // Castling rook move
  if (move.flags?.includes('castleK') || move.flags?.includes('castleQ')) {
    const backRank = piece.color === 'white' ? 0 : 7;
    if (move.flags.includes('castleK')) {
      // move rook h -> f
      const rookFrom: Square = { file: 7, rank: backRank };
      const rookTo: Square = { file: 5, rank: backRank };
      const rook = next.get(rookFrom);
      if (rook && rook.type === 'rook') { next.set(rookFrom, null); next.set(rookTo, rook); }
    } else if (move.flags.includes('castleQ')) {
      // move rook a -> d
      const rookFrom: Square = { file: 0, rank: backRank };
      const rookTo: Square = { file: 3, rank: backRank };
      const rook = next.get(rookFrom);
      if (rook && rook.type === 'rook') { next.set(rookFrom, null); next.set(rookTo, rook); }
    }
  }

  // Update castling rights (basic): if king or rooks move/capture
  const nextState: RulesState = { ...state, castling: {
    white: { ...state.castling.white },
    black: { ...state.castling.black },
  }};

  const affectRights = (color: Color, from: Square, to: Square) => {
    const backRank = color === 'white' ? 0 : 7;
    if (from.rank === backRank && from.file === 4) {
      nextState.castling[color].K = false; nextState.castling[color].Q = false;
    }
    if (from.rank === backRank && from.file === 7) nextState.castling[color].K = false;
    if (from.rank === backRank && from.file === 0) nextState.castling[color].Q = false;
    // capture rook impacts opponent rights
    if (to.rank === backRank && to.file === 7) nextState.castling[opposite(color)].K = false;
    if (to.rank === backRank && to.file === 0) nextState.castling[opposite(color)].Q = false;
  };
  affectRights(piece.color, move.from, move.to);

  // En passant target update
  if (isPawnDoublePush(piece, move.from, move.to)) {
    const dir = piece.color === 'white' ? 1 : -1;
    nextState.enPassantTarget = { file: move.from.file, rank: move.from.rank + dir };
  } else {
    nextState.enPassantTarget = null;
  }

  // Halfmove and fullmove counters
  if (piece.type === 'pawn' || captured) nextState.halfmoveClock = 0; else nextState.halfmoveClock += 1;
  if (piece.color === 'black') nextState.fullmoveNumber += 1;

  return { board: next, state: nextState, captured };
}

function opposite(c: Color): Color { return c === 'white' ? 'black' : 'white'; }

