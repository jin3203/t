import React, { useState, useEffect } from 'react';
import { Eye, Play, Pause } from 'lucide-react';

export default function MechanismVisualizer({ inputs, results, mechanismType }) {
  const [animating, setAnimating] = useState(true);
  const [posX, setPosX] = useState(0);

  useEffect(() => {
    if (!animating) return;
    let animId;
    let startTime = performance.now();
    const cycleTimeMs = (results.cycleTime || 3) * 1000;
    const accelMs = (inputs.accelTime || 0.5) * 1000;
    const moveMs = (inputs.moveTime || 2.0) * 1000;
    const constMs = moveMs - accelMs - ((inputs.decelTime || 0.5) * 1000);

    const step = (now) => {
      const elapsed = (now - startTime) % cycleTimeMs;

      let normPos = 0;
      if (elapsed < accelMs) {
        // Accel phase: s = 0.5 * a * t^2
        const progress = elapsed / accelMs;
        normPos = 0.5 * (accelMs / moveMs) * Math.pow(progress, 2);
      } else if (elapsed < accelMs + constMs) {
        // Const velocity phase
        const progress = (elapsed - accelMs) / constMs;
        const startPos = 0.5 * (accelMs / moveMs);
        const constDistRatio = constMs / moveMs;
        normPos = startPos + progress * constDistRatio;
      } else if (elapsed < moveMs) {
        // Decel phase
        const decelMs = moveMs - accelMs - constMs;
        const progress = (elapsed - accelMs - constMs) / decelMs;
        const startPos = 1 - (0.5 * (decelMs / moveMs));
        normPos = startPos + (1 - startPos) * (1 - Math.pow(1 - progress, 2));
      } else {
        // Dwell / Rest phase
        normPos = 1;
      }

      setPosX(normPos);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [animating, inputs, results]);

  const maxTravelPx = 360;
  const currentPx = posX * maxTravelPx;

  return (
    <div className="card visualizer-card">
      <div className="card-header border-purple">
        <div className="card-title">
          <Eye size={18} className="text-purple" />
          <h2>실시간 메커니즘 시뮬레이션 (2D Mechanism Simulator)</h2>
        </div>
        <button
          className="btn btn-xs btn-outline"
          onClick={() => setAnimating(!animating)}
        >
          {animating ? <Pause size={14} /> : <Play size={14} />}
          <span>{animating ? '일시정지' : '재생'}</span>
        </button>
      </div>

      <div className="card-body viz-body">
        <svg viewBox="0 0 540 160" className="viz-svg">
          <defs>
            <linearGradient id="motorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <pattern id="screwThreads" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="12" y2="12" stroke="#94a3b8" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Base Frame */}
          <rect x="20" y="120" width="500" height="12" rx="3" fill="#334155" />

          {/* Servo Motor */}
          <rect x="20" y="55" width="70" height="65" rx="6" fill="url(#motorGrad)" stroke="#1e3a8a" strokeWidth="2" />
          <text x="55" y="92" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            SERVO
          </text>
          <text x="55" y="105" fill="#93c5fd" fontSize="9" textAnchor="middle">
            {inputs.motorModel || 'CSMA_04B'}
          </text>

          {/* Flexible Coupling */}
          <rect x="90" y="77" width="20" height="20" rx="3" fill="#64748b" stroke="#334155" strokeWidth="1" />

          {/* Screw Shaft / Belt Rail */}
          <rect x="110" y="82" width="390" height="10" fill="url(#screwThreads)" stroke="#64748b" strokeWidth="1" />

          {/* Bearing Supports */}
          <rect x="110" y="70" width="14" height="50" rx="2" fill="#475569" />
          <rect x="490" y="70" width="14" height="50" rx="2" fill="#475569" />

          {/* Linear Rail Guide */}
          <rect x="120" y="112" width="370" height="6" fill="#cbd5e1" />

          {/* Moving Carriage Block (Load Mass) */}
          <g transform={`translate(${115 + currentPx}, 0)`}>
            {/* Nut Block */}
            <rect x="0" y="72" width="50" height="30" rx="4" fill="#0f766e" stroke="#042f2e" strokeWidth="1.5" />
            {/* Main Carriage Table */}
            <rect x="-10" y="42" width="70" height="30" rx="4" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
            <text x="25" y="61" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              {inputs.mass} kg
            </text>

            {/* Linear Guide Blocks */}
            <rect x="-5" y="106" width="18" height="12" rx="2" fill="#1e293b" />
            <rect x="37" y="106" width="18" height="12" rx="2" fill="#1e293b" />
          </g>

          {/* Arrow annotation for travel distance */}
          <line x1="125" y1="28" x2="485" y2="28" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="125,28 132,24 132,32" fill="#3b82f6" />
          <polygon points="485,28 478,24 478,32" fill="#3b82f6" />
          <text x="305" y="24" fill="#1d4ed8" fontSize="11" fontWeight="bold" textAnchor="middle">
            이동거리 S = {inputs.distance} m ({inputs.distance * 1000} mm)
          </text>
        </svg>

        <div className="viz-metrics font-mono">
          <span>위치: {(posX * inputs.distance).toFixed(3)} m</span>
          <span>현재 속도: {(results.profilePoints?.[1]?.velocity || inputs.maxVelocity).toFixed(2)} m/s</span>
          <span>모터 회전수: {Math.round(results.maxMotorRPM || 1500)} RPM</span>
        </div>
      </div>
    </div>
  );
}
