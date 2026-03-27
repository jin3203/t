import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="card animate-pop-in">
      <h1 className="animate-bounce">구구단<br/>마스터!</h1>
      <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '30px', fontWeight: 'bold' }}>
        신나고 재밌는 구구단 게임!
      </p>
      <button className="bubbly-btn pink" onClick={onStart}>
        게임 시작! 🚀
      </button>
    </div>
  );
}

export default StartScreen;
