export const PLAYERS = {
  flag: { symbol: '🇩🇴', name: 'Quisqueya' },
  palm: { symbol: '🌴', name: 'Los Cocoteros' },
};
export const STORAGE_KEY = 'patio-dominicano:v1';
export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];

export function getResult(board) {
  const line = LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  if (line) return { winner: board[line[0]], line, draw: false };
  return { winner: null, line: [], draw: board.every(Boolean) };
}

export function createGame(scores = { flag: 0, palm: 0, draws: 0 }) {
  return { board: Array(9).fill(null), scores };
}

export function getTurn(board) {
  return board.filter(Boolean).length % 2 === 0 ? 'flag' : 'palm';
}

// Función pura: el marcador cambia junto con la jugada que termina la ronda.
export function playMove(game, index) {
  const result = getResult(game.board);
  if (!Number.isInteger(index) || index < 0 || index > 8 || game.board[index] || result.winner || result.draw) return game;
  const board = [...game.board];
  board[index] = getTurn(board);
  const next = getResult(board);
  const scores = { ...game.scores };
  if (next.winner) scores[next.winner] += 1;
  else if (next.draw) scores.draws += 1;
  return { board, scores };
}

// Rechaza datos dañados y posiciones imposibles, incluyendo jugadas tras ganar.
function reachable(target, board = Array(9).fill(null)) {
  if (board.every((cell, i) => cell === target[i])) return true;
  const result = getResult(board);
  if (result.winner || result.draw) return false;
  const turn = getTurn(board);
  return board.some((cell, i) => {
    if (cell || target[i] !== turn) return false;
    const next = [...board];
    next[i] = turn;
    return reachable(target, next);
  });
}

export function parseSavedGame(raw) {
  try {
    const game = JSON.parse(raw);
    if (!Array.isArray(game?.board) || game.board.length !== 9 ||
      !game.board.every(cell => cell === null || Object.hasOwn(PLAYERS, cell)) ||
      !game.scores || !['flag', 'palm', 'draws'].every(key => Number.isSafeInteger(game.scores[key]) && game.scores[key] >= 0) ||
      !reachable(game.board)) return createGame();
    const result = getResult(game.board);
    if ((result.winner && game.scores[result.winner] < 1) || (result.draw && game.scores.draws < 1)) return createGame();
    return { board: game.board, scores: game.scores };
  } catch { return createGame(); }
}
