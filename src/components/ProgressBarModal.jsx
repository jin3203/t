import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function ProgressBarModal({ isOpen, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('계산 시작 중...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStatusText('계산 시작 중...');
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next < 25) {
          setStatusText('1/4 기구 파라미터 및 구동 조건 분석 중...');
        } else if (next < 55) {
          setStatusText('2/4 부하 관성모멘트(J_load) 및 구동력 산출 중...');
        } else if (next < 85) {
          setStatusText('3/4 필요 가속/감속/RMS 토크 & 모터 한계 검토 중...');
        } else if (next < 100) {
          setStatusText('4/4 회생저항 및 토크 프로파일 그래프 생성 완료!');
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 200);
          return 100;
        }
        return next;
      });
    }, 45); // ~1.0 sec total animation time

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay progress-modal-overlay">
      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-icon">
            <Cpu size={24} className="spin-icon" />
          </div>
          <div>
            <h3>모터 선정 및 물리 수식 정밀 계산 진행 중...</h3>
            <p className="progress-subtitle">공학 수식 엔진이 부하 토크, 관성비 및 회생 저항을 검토하고 있습니다.</p>
          </div>
        </div>

        <div className="progress-body">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-info-row font-mono">
            <span className="status-msg">{statusText}</span>
            <span className="percent-val">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
