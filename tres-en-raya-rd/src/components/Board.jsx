import React from 'react';
import { PLAYERS } from '../game.js';

export default function Board({ board, result, onPlay }) {
  const finished = Boolean(result.winner || result.draw);
  return (
    <div className="board" role="group" aria-label="Tablero de tres en raya">
      {board.map((player, index) => (
        <button
          key={index}
          className={`cell ${player || ''} ${result.line.includes(index) ? 'winning' : ''}`}
          disabled={Boolean(player) || finished}
          onClick={() => onPlay(index)}
          aria-label={`Fila ${Math.floor(index / 3) + 1}, columna ${index % 3 + 1}: ${player ? PLAYERS[player].name : 'vacía'}`}
        >
          <span aria-hidden="true">{player ? PLAYERS[player].symbol : ''}</span>
        </button>
      ))}
    </div>
  );
}
