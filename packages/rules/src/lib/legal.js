import { Board } from './board';
function piecePseudoMoves(board, from, piece, state) {
    switch (piece.type) {
        case 'rook':
            return board.rookMoves(from, piece.color);
        case 'bishop':
            return board.bishopMoves(from, piece.color);
        case 'queen':
            return board.queenMoves(from, piece.color);
        case 'knight':
            return board.knightMoves(from, piece.color);
        case 'king': {
            const moves = board.kingMoves(from, piece.color);
            // Castling generation
            const backRank = piece.color === 'white' ? 0 : 7;
            const side = state.castling[piece.color];
            const e = { file: 4, rank: backRank };
            if (from.file === e.file && from.rank === e.rank) {
                // Cannot be in check
                if (!board.isSquareAttacked(e, opposite(piece.color))) {
                    // King-side
                    if (side.K) {
                        const f = { file: 5, rank: backRank };
                        const g = { file: 6, rank: backRank };
                        const rookSq = { file: 7, rank: backRank };
                        if (!board.get(f) && !board.get(g)) {
                            const pathSafe = !board.isSquareAttacked(f, opposite(piece.color)) && !board.isSquareAttacked(g, opposite(piece.color));
                            const rook = board.get(rookSq);
                            if (pathSafe && rook && rook.type === 'rook' && rook.color === piece.color) {
                                moves.push({ from, to: g, flags: ['castleK'] });
                            }
                        }
                    }
                    // Queen-side
                    if (side.Q) {
                        const d = { file: 3, rank: backRank };
                        const c = { file: 2, rank: backRank };
                        const b = { file: 1, rank: backRank };
                        const rookSq = { file: 0, rank: backRank };
                        if (!board.get(d) && !board.get(c) && !board.get(b)) {
                            const pathSafe = !board.isSquareAttacked(d, opposite(piece.color)) && !board.isSquareAttacked(c, opposite(piece.color));
                            const rook = board.get(rookSq);
                            if (pathSafe && rook && rook.type === 'rook' && rook.color === piece.color) {
                                moves.push({ from, to: c, flags: ['castleQ'] });
                            }
                        }
                    }
                }
            }
            return moves;
        }
        case 'pawn': {
            const moves = board.pawnMoves(from, piece.color);
            // En passant generation
            const dir = piece.color === 'white' ? 1 : -1;
            if (state.enPassantTarget) {
                for (const dx of [-1, 1]) {
                    const to = { file: from.file + dx, rank: from.rank + dir };
                    if (to.file === state.enPassantTarget.file && to.rank === state.enPassantTarget.rank) {
                        // Ensure adjacent pawn exists behind target
                        const capturedSq = { file: to.file, rank: to.rank - dir };
                        const cap = board.get(capturedSq);
                        if (cap && cap.type === 'pawn' && cap.color !== piece.color && !board.get(to)) {
                            moves.push({ from, to, flags: ['enPassant'] });
                        }
                    }
                }
            }
            return moves;
        }
    }
}
function opposite(c) { return c === 'white' ? 'black' : 'white'; }
export function legalMoves(board, state, from, color) {
    const piece = board.get(from);
    if (!piece || piece.color !== color)
        return [];
    const pseudo = piecePseudoMoves(board, from, piece, state);
    const res = [];
    for (const m of pseudo) {
        const clone = board.clone();
        clone.movePiece(m);
        // Find king square after move
        let kingSq = null;
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = clone.get({ file: f, rank: r });
                if (p && p.type === 'king' && p.color === color) {
                    kingSq = { file: f, rank: r };
                    break;
                }
            }
            if (kingSq)
                break;
        }
        if (!kingSq)
            continue;
        if (!clone.isSquareAttacked(kingSq, opposite(color)))
            res.push(m);
    }
    return res;
}
