import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, getResult, getTurn, LINES, parseSavedGame, playMove } from '../src/game.js';

function sequence(indices) { return indices.reduce(playMove, createGame()); }

test('reconoce las ocho líneas ganadoras para ambos equipos', () => {
  for (const line of LINES) for (const player of ['flag', 'palm']) {
    const board = Array(9).fill(null);
    line.forEach(index => { board[index] = player; });
    assert.equal(getResult(board).winner, player);
    assert.deepEqual(getResult(board).line, line);
  }
});
test('alterna turnos y rechaza casillas ocupadas e índices inválidos', () => {
  const game = playMove(createGame(), 0);
  assert.equal(getTurn(game.board), 'palm');
  for (const index of [0, -1, 9, 1.5]) assert.equal(playMove(game, index), game);
});
test('una victoria suma solo una vez y bloquea el tablero', () => {
  const game = sequence([0, 3, 1, 4, 2]);
  assert.equal(game.scores.flag, 1);
  assert.equal(playMove(game, 8), game);
  const restored = parseSavedGame(JSON.stringify(game));
  assert.deepEqual(restored, game);
  assert.equal(playMove(restored, 8), restored);
  assert.deepEqual(createGame(game.scores).scores, game.scores);
});
test('empate y victoria del segundo equipo', () => {
  const draw = sequence([0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.equal(getResult(draw.board).draw, true);
  assert.equal(draw.scores.draws, 1);
  assert.equal(playMove(draw, 0), draw);
  const palm = sequence([0, 3, 1, 4, 8, 5]);
  assert.equal(palm.scores.palm, 1);
});
test('restaura partidas y descarta JSON o estados imposibles', () => {
  const game = sequence([0, 4, 2]);
  assert.deepEqual(parseSavedGame(JSON.stringify(game)), game);
  for (const raw of [null, '{oops', '{}', JSON.stringify({ board: Array(9).fill('palm'), scores: game.scores }), JSON.stringify({ board: ['flag','flag','flag','palm','palm','palm',null,null,null], scores: game.scores })]) {
    assert.deepEqual(parseSavedGame(raw), createGame());
  }
});
