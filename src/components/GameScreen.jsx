import React, { useState, useEffect } from 'react';

const TOTAL_QUESTIONS = 10;

function GameScreen({ onEnd }) {
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct', 'wrong', null

  useEffect(() => {
    generateProblem();
  }, [questionCount]);

  const generateProblem = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      onEnd(score);
      return;
    }

    const a = Math.floor(Math.random() * 8) + 2; // 2 ~ 9
    const b = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
    const answer = a * b;

    // Generate wrong answers
    let options = new Set([answer]);
    while (options.size < 4) {
      // Create plausible wrong answers
      let wrongFactorA = Math.floor(Math.random() * 8) + 2;
      let wrongFactorB = Math.floor(Math.random() * 9) + 1;
      let diff = Math.floor(Math.random() * 5) + 1;
      let wrongAnswer = Math.random() > 0.5 ? answer + diff : answer - diff;
      if (wrongAnswer > 0) options.add(wrongAnswer);
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    setCurrentProblem({ a, b, answer });
    setChoices(shuffledOptions);
    setFeedbackState(null);
  };

  const handleChoice = (selected) => {
    if (feedbackState) return; // Prevent multiple clicks

    if (selected === currentProblem.answer) {
      setFeedbackState('correct');
      setScore(prev => prev + 10);
      setTimeout(() => {
        setQuestionCount(prev => prev + 1);
      }, 800);
    } else {
      setFeedbackState('wrong');
      setTimeout(() => {
        setQuestionCount(prev => prev + 1);
      }, 800);
    }
  };

  if (!currentProblem) return null;

  return (
    <div className={`card ${feedbackState === 'wrong' ? 'animate-shake' : ''}`}>
      <div className="score-badge">
        문제: {questionCount + 1} / {TOTAL_QUESTIONS} | 점수: {score}점
      </div>
      
      <h2 style={{ fontSize: '5rem', color: '#ff0080', textShadow: '4px 4px 0 #ccff00', margin: '20px 0' }}>
        {currentProblem.a} <span style={{color: '#00ffcc'}}>✖</span> {currentProblem.b} <span style={{color: '#00ffcc'}}>=</span> ?
      </h2>

      {feedbackState === 'correct' && (
        <h3 className="animate-pop-in" style={{ color: '#00cc66', fontSize: '2.5rem', margin: '10px 0' }}>정답이야! 🌟</h3>
      )}
      {feedbackState === 'wrong' && (
        <h3 className="animate-pop-in" style={{ color: '#cc0000', fontSize: '2.5rem', margin: '10px 0' }}>아쉽다! 💦</h3>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {choices.map((choice, i) => {
          // Color selection based on index to make them colorful
          const colorClass = ['pink', 'yellow', '', 'pink'][i % 4];
          return (
            <button 
              key={i} 
              className={`bubbly-btn ${colorClass}`} 
              style={{ width: '40%', margin: '10px' }}
              onClick={() => handleChoice(choice)}
              disabled={!!feedbackState}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameScreen;
