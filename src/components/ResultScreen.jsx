import React from 'react';

function ResultScreen({ score, onRestart }) {
  let message = '';
  if (score === 100) message = '완벽해! 넌 진짜 구구단 마스터야! 🏆';
  else if (score >= 70) message = '와우! 정말 잘했어! 🌟';
  else message = '조금만 더 연습하면 완벽해질 거야! 💪';

  return (
    <div className="card animate-pop-in">
      <h1 style={{ color: '#00ffcc', textShadow: '4px 4px 0 #ff0080' }}>게임 끝!</h1>
      <h2 style={{ fontSize: '4rem', color: '#333', textShadow: 'none' }}>
        내 점수: <span style={{ color: '#ff0080' }}>{score}</span>점
      </h2>
      <p style={{ fontSize: '2rem', color: '#666', marginBottom: '40px', fontWeight: 'bold' }}>
        {message}
      </p>
      
      <button className="bubbly-btn yellow" onClick={onRestart}>
        다시 하기 🔄
      </button>
    </div>
  );
}

export default ResultScreen;
