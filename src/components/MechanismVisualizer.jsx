import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function MechanismVisualizer({ inputs, results, mechanismType }) {
  const getMechanismTitle = () => {
    switch (mechanismType) {
      case 'ballscrew_h': return '수평 볼스크류 기구 구성도 (Horizontal BallScrew Diagram)';
      case 'ballscrew_v': return '수직 볼스크류 기구 구성도 (Vertical BallScrew Diagram)';
      case 'belt_h': return '수평 타이밍 벨트 기구 구성도 (Timing Belt Diagram)';
      case 'rack_pinion': return '랙 & 피니언 기구 구성도 (Rack & Pinion Diagram)';
      case 'rotary': return '회전 테이블 기구 구성도 (Rotary Table Diagram)';
      default: return '기구 구성 도면 (Mechanism Diagram)';
    }
  };

  return (
    <div className="card visualizer-card">
      <div className="card-header border-purple">
        <div className="card-title">
          <ImageIcon size={18} className="text-purple" />
          <h2>{getMechanismTitle()}</h2>
        </div>
      </div>

      <div className="card-body viz-body">
        <svg viewBox="0 0 560 170" className="viz-svg">
          <defs>
            <linearGradient id="motorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <pattern id="screwThreads" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="12" y2="12" stroke="#94a3b8" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Base Frame */}
          <rect x="20" y="130" width="520" height="14" rx="3" fill="#334155" />
          <text x="280" y="141" fill="#cbd5e1" fontSize="9" textAnchor="middle">BASE FRAME (기구 지지대)</text>

          {/* Servo Motor */}
          <rect x="30" y="60" width="75" height="70" rx="6" fill="url(#motorGrad)" stroke="#1e3a8a" strokeWidth="2" />
          <text x="67" y="80" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            SERVO
          </text>
          <text x="67" y="94" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            MOTOR
          </text>
          <text x="67" y="110" fill="#93c5fd" fontSize="9" fontWeight="600" textAnchor="middle">
            {inputs.motorModel || 'Selected Motor'}
          </text>

          {/* Flexible Coupling */}
          <rect x="105" y="85" width="24" height="20" rx="3" fill="#64748b" stroke="#334155" strokeWidth="1" />
          <text x="117" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle">Coupling</text>

          {/* Screw Shaft / Belt Rail */}
          <rect x="129" y="90" width="370" height="10" fill="url(#screwThreads)" stroke="#64748b" strokeWidth="1" />

          {/* Bearing Support Blocks */}
          <rect x="129" y="75" width="16" height="55" rx="2" fill="#475569" />
          <text x="137" y="68" fill="#94a3b8" fontSize="8" textAnchor="middle">Support A</text>
          <rect x="483" y="75" width="16" height="55" rx="2" fill="#475569" />
          <text x="491" y="68" fill="#94a3b8" fontSize="8" textAnchor="middle">Support B</text>

          {/* Linear Guide Rail */}
          <rect x="145" y="122" width="338" height="8" fill="#94a3b8" />
          <text x="314" y="128" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">LINEAR GUIDE RAIL</text>

          {/* Moving Table (Load Mass) */}
          <g transform="translate(260, 0)">
            {/* Nut Block */}
            <rect x="0" y="80" width="55" height="30" rx="4" fill="#0f766e" stroke="#042f2e" strokeWidth="1.5" />
            {/* Table Top */}
            <rect x="-15" y="48" width="85" height="32" rx="5" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
            <text x="27" y="68" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              LOAD: {inputs.mass} kg
            </text>
            {/* Guide Block */}
            <rect x="-8" y="116" width="20" height="14" rx="2" fill="#1e293b" />
            <rect x="43" y="116" width="20" height="14" rx="2" fill="#1e293b" />
          </g>

          {/* Dimension Arrows */}
          <line x1="145" y1="32" x2="483" y2="32" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
          <polygon points="145,32 152,28 152,36" fill="#2563eb" />
          <polygon points="483,32 476,28 476,36" fill="#2563eb" />
          <text x="314" y="27" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
            유효 이동거리 S = {inputs.distance} m ({inputs.distance * 1000} mm) | Lead = {inputs.lead * 1000} mm
          </text>
        </svg>

        <div className="viz-metrics font-mono">
          <span>기구 종류: {mechanismType}</span>
          <span>부하 질량: {inputs.mass} kg</span>
          <span>스크류 리드: {inputs.lead * 1000} mm</span>
          <span>목표 최고속도: {inputs.maxVelocity} m/s</span>
        </div>
      </div>
    </div>
  );
}
