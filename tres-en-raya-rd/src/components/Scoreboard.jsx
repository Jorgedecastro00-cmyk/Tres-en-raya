import React from 'react';
import { PLAYERS } from '../game.js';

export default function Scoreboard({ scores, turn, finished }) {
  return (
    <section className="scores" aria-label="Marcador acumulado">
      {Object.entries(PLAYERS).map(([id, player]) => (
        <div key={id} className={`score ${id} ${!finished && turn === id ? 'active' : ''}`}>
          <span className="score-label">{player.symbol} {player.name}</span>
          <strong>{scores[id]}</strong>
          <small>victorias</small>
        </div>
      ))}
      <div className="score draws"><span className="score-label">En tablas</span><strong>{scores.draws}</strong><small>empates</small></div>
    </section>
  );
}
