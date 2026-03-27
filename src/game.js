const root = document.getElementById('root');
let state = 'start'; // 'start', 'playing', 'result'
let score = 0;
let questionCount = 0;
const TOTAL_QUESTIONS = 10;
let currentProblem = null;
let feedbackState = null;

function render() {
  if (state === 'start') {
    root.innerHTML = `
      <div class="card animate-pop-in">
        <h1 class="animate-bounce">구구단<br/>마스터!</h1>
        <p style="font-size: 1.5rem; color: #666; margin-bottom: 30px; font-weight: bold;">
          신나고 재밌는 구구단 게임!
        </p>
        <button class="bubbly-btn pink" onclick="startGame()">
          게임 시작! 🚀
        </button>
      </div>
    `;
  } else if (state === 'playing') {
    if (!currentProblem) return;
    
    // 버튼 색상 클래스 (알록달록하게)
    const colorClasses = ['pink', 'yellow', '', 'pink'];
    
    let choicesHtml = currentProblem.choices.map((choice, i) => {
      const colorClass = colorClasses[i % 4];
      return `<button class="bubbly-btn ${colorClass}" style="width: 40%; margin: 10px;" onclick="handleChoice(${choice})" ${feedbackState ? 'disabled' : ''}>${choice}</button>`;
    }).join('');

    let feedbackHtml = '';
    if (feedbackState === 'correct') {
      feedbackHtml = `<h3 class="animate-pop-in" style="color: #00cc66; font-size: 2.5rem; margin: 10px 0;">정답이야! 🌟</h3>`;
    } else if (feedbackState === 'wrong') {
       feedbackHtml = `<h3 class="animate-pop-in" style="color: #cc0000; font-size: 2.5rem; margin: 10px 0;">아쉽다! 💦</h3>`;
    }

    root.innerHTML = `
      <div class="card ${feedbackState === 'wrong' ? 'animate-shake' : ''}">
        <div class="score-badge">
          문제: ${questionCount + 1} / ${TOTAL_QUESTIONS} | 점수: ${score}점
        </div>
        <h2 style="font-size: 5rem; color: #ff0080; text-shadow: 4px 4px 0 #ccff00; margin: 20px 0;">
          ${currentProblem.a} <span style="color: #00ffcc;">✖</span> ${currentProblem.b} <span style="color: #00ffcc;">=</span> ?
        </h2>
        ${feedbackHtml}
        <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
          ${choicesHtml}
        </div>
      </div>
    `;
  } else if (state === 'result') {
    let message = '';
    if (score === 100) message = '완벽해! 넌 진짜 구구단 마스터야! 🏆';
    else if (score >= 70) message = '와우! 정말 잘했어! 🌟';
    else message = '조금만 더 연습하면 완벽해질 거야! 💪';

    root.innerHTML = `
      <div class="card animate-pop-in">
        <h1 style="color: #00ffcc; text-shadow: 4px 4px 0 #ff0080;">게임 끝!</h1>
        <h2 style="font-size: 4rem; color: #333; text-shadow: none;">
          내 점수: <span style="color: #ff0080;">${score}</span>점
        </h2>
        <p style="font-size: 2rem; color: #666; margin-bottom: 40px; font-weight: bold;">
          ${message}
        </p>
        <button class="bubbly-btn yellow" onclick="startGame()">
          다시 하기 🔄
        </button>
      </div>
    `;
  }
}

window.startGame = () => {
  score = 0;
  questionCount = 0;
  state = 'playing';
  generateProblem();
};

function generateProblem() {
  if (questionCount >= TOTAL_QUESTIONS) {
    state = 'result';
    render();
    return;
  }
  const a = Math.floor(Math.random() * 8) + 2; // 2~9단
  const b = Math.floor(Math.random() * 9) + 1; // 1~9
  const answer = a * b;

  let options = new Set([answer]);
  while (options.size < 4) {
    let diff = Math.floor(Math.random() * 5) + 1;
    let wrongAnswer = Math.random() > 0.5 ? answer + diff : answer - diff;
    if (wrongAnswer > 0) options.add(wrongAnswer);
  }
  
  currentProblem = { 
    a, b, answer, 
    choices: Array.from(options).sort(() => Math.random() - 0.5) 
  };
  feedbackState = null;
  render();
}

window.handleChoice = (selected) => {
  if (feedbackState) return; // 중복 클릭 방지

  if (selected === currentProblem.answer) {
    feedbackState = 'correct';
    score += 10;
  } else {
    feedbackState = 'wrong';
  }
  render();

  setTimeout(() => {
    questionCount++;
    generateProblem();
  }, 1000);
};

// 최초 화면 렌더링
render();
