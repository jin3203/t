import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'result'
  const [score, setScore] = useState(0);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setGameState('result');
  };

  return (
    <div className="app-container">
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      {gameState === 'playing' && <GameScreen onEnd={endGame} />}
      {gameState === 'result' && <ResultScreen score={score} onRestart={startGame} />}
    </div>
  );
}

export default App;
