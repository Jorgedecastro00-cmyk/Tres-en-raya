import React, { useEffect, useState } from 'react';
import Board from './components/Board.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import { PLAYERS, STORAGE_KEY, createGame, getResult, getTurn, parseSavedGame, playMove } from './game.js';

function loadGame() {
  try { return parseSavedGame(localStorage.getItem(STORAGE_KEY)); }
  catch { return createGame(); }
}

export default function App() {
  const [game, setGame] = useState(loadGame);
  const [saveFailed, setSaveFailed] = useState(false);
  const result = getResult(game.board);
  const turn = getTurn(game.board);
  const finished = Boolean(result.winner || result.draw);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
      setSaveFailed(false);
    } catch { setSaveFailed(true); }
  }, [game]);

  const status = result.winner
    ? `¡${PLAYERS[result.winner].name} se llevó la vuelta!`
    : result.draw ? '¡Empate! Aquí hay nivel, mi gente.' : `Le toca a ${PLAYERS[turn].name}`;

  return (
    <main className="patio">
      <header className="topbar">
        <a className="brand" href="./"><span className="flag-mark" aria-hidden="true" />PATIO DOMINICANO</a>
        <span className="edition">EDICIÓN DE BARRIO · 01</span>
      </header>
      <div className="layout">
        <section className="intro">
          <span className="eyebrow">DOS JUGADORES. UN CORO.</span>
          <h1>Tres en raya.<br /><em>Mucho sabor.</em></h1>
          <p>Arma tu línea, cuida tu esquina y demuestra quién manda en el patio.</p>
          <div className="matchup"><span>🇩🇴 Quisqueya</span><b>VS</b><span>🌴 Los Cocoteros</span></div>
          <div className="howto">
            <span className="number">01 /</span>
            <div>
              <h2>La vuelta es sencilla</h2>
              <p>Jueguen por turnos en el mismo dispositivo. Conecta tres fichas en fila, columna o diagonal. Quisqueya abre cada ronda.</p>
            </div>
          </div>
          <div className="note">Hecho con lógica, café y un chin de tigueraje. ☕</div>
        </section>
        <section className="game-card" aria-label="Partida">
          <div className="card-heading">
            <span>EL PATIO ESTÁ ABIERTO</span>
            <span className="live-dot" aria-hidden="true" />
          </div>
          <Scoreboard scores={game.scores} turn={turn} finished={finished} />
          <div className="status" role="status" aria-live="polite">
            <span aria-hidden="true">{result.winner ? '🏆' : result.draw ? '🤝' : PLAYERS[turn].symbol}</span>
            <h2>{status}</h2>
          </div>
          <Board board={game.board} result={result} onPlay={index => setGame(previous => playMove(previous, index))} />
          <button className="primary" onClick={() => setGame(previous => createGame(previous.scores))}>
            ¡Volví a empezar! <span aria-hidden="true">↗</span>
          </button>
          <div className="card-footer">
            <span>{saveFailed ? 'Esta sesión no se puede guardar.' : 'Partida y marcador guardados en este navegador'}</span>
            <button className="reset" onClick={() => { if (window.confirm('¿Borrar la partida y todo el marcador?')) setGame(createGame()); }}>
              Borrar todo
            </button>
          </div>
        </section>
      </div>
      <footer className="page-footer">
        <span>DE QUISQUEYA PARA EL CORO.</span>
        <span>Azul, rojo y ganas de jugar. 🇩🇴</span>
      </footer>
    </main>
  );
}