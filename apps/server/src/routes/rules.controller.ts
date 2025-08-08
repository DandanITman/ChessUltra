import { Controller, Get, Query } from '@nestjs/common';
import { Board, initialRulesState, legalMoves } from '@chessultra/rules';

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
}

