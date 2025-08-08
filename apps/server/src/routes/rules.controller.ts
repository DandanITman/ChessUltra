import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Board, initialRulesState, legalMoves, applyMove } from '@chessultra/rules';

@Controller('rules')
export class RulesController {
  @Get('health')
  health() {
    return { ok: true };
  }

  // Quick test endpoint: returns rook moves from center on empty board
  @Get('rook')
  rook(@Query('file') file = '3', @Query('rank') rank = '3') {
    const b = new Board();
    const f = Number(file), r = Number(rank);
    const from = { file: f, rank: r };
    b.set(from, { type: 'rook', color: 'white' });
    const moves = b.rookMoves(from, 'white');
    return { from, count: moves.length, moves };
  }

  // Quick test endpoint: legal moves for a simple position
  @Get('legal')
  legal() {
    const b = new Board();
    // basic pieces for a small legal test
    b.set({ file: 4, rank: 0 }, { type: 'king', color: 'white' });
    b.set({ file: 4, rank: 7 }, { type: 'king', color: 'black' });
    b.set({ file: 0, rank: 1 }, { type: 'pawn', color: 'white' });

    const st = initialRulesState();
    const from = { file: 0, rank: 1 } as const;
    const moves = legalMoves(b, st, from, 'white');
    return { from, count: moves.length, moves };
  }

  // POST /rules/legal: compute legal moves for an arbitrary position
  @Post('legal')
  legalPost(@Body() body: any) {
    const b = new Board();
    const { pieces = [], from, color = 'white', state } = body ?? {};
    for (const p of pieces) {
      b.set({ file: p.file, rank: p.rank }, { type: p.type, color: p.color });
    }
    const st = state ? { ...initialRulesState(), ...state } : initialRulesState();
    const moves = legalMoves(b, st, from, color);
    return { count: moves.length, moves };
  }

  // POST /rules/apply: apply a move and return new board pieces and state
  @Post('apply')
  apply(@Body() body: any) {
    const b = new Board();
    const { pieces = [], move, state } = body ?? {};
    for (const p of pieces) {
      b.set({ file: p.file, rank: p.rank }, { type: p.type, color: p.color });
    }
    const st = state ? { ...initialRulesState(), ...state } : initialRulesState();
    const res = applyMove(b, st, move);
    const nextPieces: any[] = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = res.board.get({ file, rank });
        if (piece) nextPieces.push({ file, rank, type: piece.type, color: piece.color });
      }
    }
    return { pieces: nextPieces, state: res.state };
  }
}

