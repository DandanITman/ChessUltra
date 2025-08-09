import { Body, Controller, Post } from '@nestjs/common';
import { Board, initialRulesState, legalMoves, applyMove } from '@chessultra/rules';
import type { Color, RulesState, Square } from '@chessultra/rules';

function startingPosition(): { pieces: any[]; state: RulesState; sideToMove: Color } {
  const pieces: any[] = [];
  // Place all pieces for both sides
  const back: Array<{ type: any; file: number }>[] = [
    [
      { type: 'rook', file: 0 }, { type: 'knight', file: 1 }, { type: 'bishop', file: 2 }, { type: 'queen', file: 3 },
      { type: 'king', file: 4 }, { type: 'bishop', file: 5 }, { type: 'knight', file: 6 }, { type: 'rook', file: 7 },
    ],
    [
      { type: 'rook', file: 0 }, { type: 'knight', file: 1 }, { type: 'bishop', file: 2 }, { type: 'queen', file: 3 },
      { type: 'king', file: 4 }, { type: 'bishop', file: 5 }, { type: 'knight', file: 6 }, { type: 'rook', file: 7 },
    ],
  ];
  // white back rank (rank 0) and pawns (rank 1)
  for (const e of back[0]) pieces.push({ file: e.file, rank: 0, type: e.type, color: 'white' });
  for (let f = 0; f < 8; f++) pieces.push({ file: f, rank: 1, type: 'pawn', color: 'white' });
  // black back rank (rank 7) and pawns (rank 6)
  for (const e of back[1]) pieces.push({ file: e.file, rank: 7, type: e.type, color: 'black' });
  for (let f = 0; f < 8; f++) pieces.push({ file: f, rank: 6, type: 'pawn', color: 'black' });

  const state = initialRulesState();
  return { pieces, state, sideToMove: 'white' };
}

function scoreMaterial(p: any): number {
  switch (p.type) {
    case 'queen': return 9;
    case 'rook': return 5;
    case 'bishop':
    case 'knight': return 3;
    case 'pawn': return 1;
    case 'king': return 0;
    default: return 0;
  }
}

function evaluate(pieces: any[], perspective: Color): number {
  let s = 0;
  for (const p of pieces) {
    const v = scoreMaterial(p);
    s += p.color === perspective ? v : -v;
  }
  return s;
}

function listAllMoves(pieces: any[], st: RulesState, color: Color): Array<{ move: any; from: Square }> {
  const b = new Board();
  for (const p of pieces) b.set({ file: p.file, rank: p.rank }, { type: p.type, color: p.color });
  const res: Array<{ move: any; from: Square }> = [];
  for (const p of pieces) {
    if (p.color !== color) continue;
    const from = { file: p.file, rank: p.rank } as const;
    for (const m of legalMoves(b, st, from, color)) res.push({ move: m, from });
  }
  return res;
}

function applyOnPieces(pieces: any[], st: RulesState, m: any): { pieces: any[]; state: RulesState } {
  const b = new Board();
  for (const p of pieces) b.set({ file: p.file, rank: p.rank }, { type: p.type, color: p.color });
  const res = applyMove(b, st, m);
  const nextPieces: any[] = [];
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = res.board.get({ file, rank });
      if (piece) nextPieces.push({ file, rank, type: piece.type, color: piece.color });
    }
  }
  return { pieces: nextPieces, state: res.state };
}

function chooseBotMove(pieces: any[], st: RulesState, botColor: Color): any | null {
  // Simple 1-ply: any capture preferred, else random
  const moves = listAllMoves(pieces, st, botColor);
  if (moves.length === 0) return null;

  const captures = moves.filter(({ move }) => move.flags?.includes('capture') || false);
  if (captures.length > 0) return captures[Math.floor(Math.random() * captures.length)].move;

  return moves[Math.floor(Math.random() * moves.length)].move;
}

@Controller('bot')
export class BotController {
  @Post('start')
  start() {
    return startingPosition();
  }

  @Post('move')
  move(@Body() body: any) {
    const { pieces = [], state, sideToMove = 'white', ai = 'black' } = body ?? {};
    // If it's the bot's turn, pick a move for the bot
    const st: RulesState = state ?? initialRulesState();

    if (sideToMove === ai) {
      const botMove = chooseBotMove(pieces, st, ai);
      if (!botMove) return { pieces, state: st, sideToMove }; // no move: checkmate/stalemate
      const { pieces: p2, state: s2 } = applyOnPieces(pieces, st, botMove);
      return { pieces: p2, state: s2, sideToMove: sideToMove === 'white' ? 'black' : 'white', botMove };
    } else {
      // Otherwise, assume the client applied a legal move and just return turn switch
      return { pieces, state: st, sideToMove: sideToMove === 'white' ? 'black' : 'white' };
    }
  }
}

