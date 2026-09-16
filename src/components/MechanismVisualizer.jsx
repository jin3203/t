import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ballscrewHImg from '../assets/ballscrew_h.png';

export default function MechanismVisualizer({ inputs, results, mechanismType }) {
  const getMechanismTitle = () => {
    switch (mechanismType) {
      case 'ballscrew_h': return '수평 볼스크류 기구 구성도 (Horizontal BallScrew Diagram)';
      case 'ballscrew_v': return '수직 볼스크류 기구 구성도 (Vertical BallScrew Diagram)';
      case 'belt_h': return '수평 타이밍 벨트 기구 구성도 (Timing Belt Diagram)';
      case 'direct': return '직결 구동 기구 구성도 (Direct Coupling Drive Diagram)';
      case 'rack_pinion': return '랙 & 피니언 기구 구성도 (Rack & Pinion Diagram)';
      case 'rotary': return '회전 테이블 기구 구성도 (Rotary Table Diagram)';
      default: return '기구 구성 도면 (Mechanism Diagram)';
    }
  };

  const motorModel = inputs.motorModel || 'Selected Motor';
  const massKg = inputs.mass || 0;
  const distMm = (inputs.distance || 0) * 1000;
  const leadMm = (inputs.lead || 0) * 1000;
  const pulleyDiaMm = ((inputs.pulleyDiameter || 0.05) * 1000).toFixed(0);
  const gearRatio = inputs.gearRatio || 1.0;
  const thrustForce = inputs.thrustForce || 0;

  // Reusable Motor SVG component
  const renderMotor = (x, y, w = 75, h = 70) => (
    <g key="motor">
      <rect x={x} y={y} width={w} height={h} rx="6" fill="url(#motorGrad)" stroke="#1e3a8a" strokeWidth="2" />
      <text x={x + w / 2} y={y + 20} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
        SERVO
      </text>
      <text x={x + w / 2} y={y + 34} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
        MOTOR
      </text>
      <text x={x + w / 2} y={y + 50} fill="#93c5fd" fontSize="9" fontWeight="600" textAnchor="middle">
        {motorModel}
      </text>
    </g>
  );

  // Reusable Coupling SVG component (Enlarged with text inside)
  const renderCoupling = (x, y, w = 52, h = 50) => (
    <g key="coupling">
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 + 3} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
        COUPLING
      </text>
    </g>
  );

  // Render SVG diagram depending on mechanismType
  const renderDiagramContent = () => {
    switch (mechanismType) {
      // 2. Vertical BallScrew
      case 'ballscrew_v':
        return (
          <>
            {/* Base Frame (Top & Bottom) */}
            <rect x="180" y="20" width="160" height="12" rx="2" fill="#334155" />
            <rect x="180" y="175" width="160" height="12" rx="2" fill="#334155" />

            {/* Servo Motor (Top) */}
            {renderMotor(222, 32, 75, 55)}
            {/* Coupling */}
            {renderCoupling(233.5, 87, 52, 32)}

            {/* Vertical BallScrew Shaft */}
            <rect x="254" y="119" width="11" height="56" fill="url(#screwThreads)" stroke="#64748b" strokeWidth="1" />

            {/* Vertical Linear Guide Rails */}
            <rect x="200" y="119" width="6" height="56" fill="#94a3b8" />
            <rect x="313" y="119" width="6" height="56" fill="#94a3b8" />

            {/* Moving Load Table (Vertical) */}
            <g transform="translate(195, 125)">
              <rect x="0" y="0" width="130" height="30" rx="4" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
              <text x="65" y="19" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                LOAD: {massKg} kg (수직 부하)
              </text>
            </g>

            {/* Gravity Force Arrow (F_g = m*g) */}
            <g transform="translate(345, 125)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#dc2626" strokeWidth="2.5" />
              <polygon points="0,40 -4,32 4,32" fill="#dc2626" />
              <text x="8" y="24" fill="#dc2626" fontSize="10" fontWeight="bold">
                F_g = {massKg}kg × g (중력)
              </text>
            </g>

            {/* Dimension Line (Height) */}
            <line x1="150" y1="32" x2="150" y2="170" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="150,32 146,39 154,39" fill="#2563eb" />
            <polygon points="150,170 146,163 154,163" fill="#2563eb" />
            <text x="140" y="105" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="end">
              H = {distMm} mm
            </text>
          </>
        );

      // 3. Horizontal Belt Drive
      case 'belt_h':
        return (
          <>
            {/* Base Frame */}
            <rect x="20" y="140" width="520" height="14" rx="3" fill="#334155" />
            <text x="280" y="151" fill="#cbd5e1" fontSize="9" textAnchor="middle">BASE FRAME (기구 지지대)</text>

            {renderMotor(30, 70)}
            {renderCoupling(105, 80, 52, 50)}

            {/* Drive Pulley & Idle Pulley */}
            <circle cx="180" cy="105" r="18" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <circle cx="180" cy="105" r="6" fill="#cbd5e1" />
            <circle cx="470" cy="105" r="18" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <circle cx="470" cy="105" r="6" fill="#cbd5e1" />

            {/* Timing Belt Loops */}
            <line x1="180" y1="87" x2="470" y2="87" stroke="#1e293b" strokeWidth="4" />
            <line x1="180" y1="123" x2="470" y2="123" stroke="#1e293b" strokeWidth="4" />

            {/* Linear Guide Rail */}
            <rect x="180" y="132" width="290" height="8" fill="#94a3b8" />

            {/* Belt Carriage & Load Mass */}
            <g transform="translate(280, 0)">
              <rect x="-10" y="80" width="70" height="16" rx="3" fill="#0f766e" stroke="#042f2e" strokeWidth="1" />
              <rect x="-20" y="48" width="90" height="32" rx="5" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
              <text x="25" y="68" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                LOAD: {massKg} kg
              </text>
            </g>

            {/* Dimension Line */}
            <line x1="180" y1="35" x2="470" y2="35" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="180,35 187,31 187,39" fill="#2563eb" />
            <polygon points="470,35 463,31 463,39" fill="#2563eb" />
            <text x="325" y="28" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
              벨트 이송거리 S = {distMm} mm | 풀리 지름 D = {pulleyDiaMm} mm
            </text>
          </>
        );

      // 4. Direct Coupling Drive
      case 'direct':
        return (
          <>
            {/* Base Frame */}
            <rect x="40" y="140" width="480" height="14" rx="3" fill="#334155" />
            <text x="280" y="151" fill="#cbd5e1" fontSize="9" textAnchor="middle">BASE FRAME (1:1 직결 지지대)</text>

            {renderMotor(50, 70)}
            {renderCoupling(125, 80, 52, 50)}

            {/* Output Shaft */}
            <rect x="177" y="100" width="140" height="10" fill="#94a3b8" stroke="#475569" strokeWidth="1" />

            {/* Directly Coupled Load Rotor / Flywheel */}
            <g transform="translate(317, 45)">
              <rect x="0" y="0" width="100" height="90" rx="8" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
              <text x="50" y="42" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                DIRECT LOAD
              </text>
              <text x="50" y="58" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                {massKg} kg
              </text>
            </g>

            {/* 1:1 Direct Coupling Annotation */}
            <line x1="177" y1="40" x2="317" y2="40" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="177,40 184,36 184,44" fill="#2563eb" />
            <polygon points="317,40 310,36 310,44" fill="#2563eb" />
            <text x="247" y="32" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
              직결 구동 (1:1 Direct Drive Connection) | 부하 = {massKg} kg
            </text>
          </>
        );

      // 5. Rack & Pinion
      case 'rack_pinion':
        return (
          <>
            {/* Fixed Rack Bar (Bottom) */}
            <rect x="80" y="125" width="410" height="16" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            {/* Rack Teeth */}
            <line x1="90" y1="125" x2="90" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="120" y1="125" x2="120" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="150" y1="125" x2="150" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="180" y1="125" x2="180" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="210" y1="125" x2="210" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="240" y1="125" x2="240" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="270" y1="125" x2="270" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="300" y1="125" x2="300" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="330" y1="125" x2="330" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="360" y1="125" x2="360" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="390" y1="125" x2="390" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="420" y1="125" x2="420" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="450" y1="125" x2="450" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="480" y1="125" x2="480" y2="132" stroke="#cbd5e1" strokeWidth="2" />
            <text x="285" y="153" fill="#cbd5e1" fontSize="9" textAnchor="middle">고정 랙 바 (FIXED RACK BAR)</text>

            {renderMotor(50, 45)}
            {renderCoupling(125, 55, 52, 50)}

            {/* Pinion Gear */}
            <circle cx="210" cy="105" r="20" fill="#0f766e" stroke="#042f2e" strokeWidth="2" />
            <circle cx="210" cy="105" r="6" fill="#cbd5e1" />
            <text x="210" y="108" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">PINION</text>

            {/* Moving Load Carriage */}
            <g transform="translate(245, 45)">
              <rect x="0" y="0" width="110" height="60" rx="6" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2" />
              <text x="55" y="28" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                RACK CARRIAGE
              </text>
              <text x="55" y="44" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                LOAD: {massKg} kg
              </text>
            </g>

            {/* Dimension Line */}
            <line x1="80" y1="22" x2="490" y2="22" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="80,22 87,18 87,26" fill="#2563eb" />
            <polygon points="490,22 483,18 483,26" fill="#2563eb" />
            <text x="285" y="16" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
              랙 피니언 이송거리 S = {distMm} mm | 피니언 피치 지름 D = {pulleyDiaMm} mm
            </text>
          </>
        );

      // 6. Rotary Table
      case 'rotary':
        return (
          <>
            {/* Base Frame */}
            <rect x="40" y="145" width="480" height="14" rx="3" fill="#334155" />
            <text x="280" y="156" fill="#cbd5e1" fontSize="9" textAnchor="middle">BASE FRAME (회전 테이블 고정대)</text>

            {renderMotor(30, 65)}
            {renderCoupling(105, 75, 52, 50)}

            {/* Gear Reducer / Bevel Gear Box */}
            <g transform="translate(157, 70)">
              <rect x="0" y="0" width="55" height="60" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              <text x="27.5" y="28" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">GEAR</text>
              <text x="27.5" y="42" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">1:{gearRatio}</text>
            </g>

            {/* Rotary Table Disc (Isometric Oval View) */}
            <g transform="translate(370, 95)">
              {/* Table Thickness */}
              <ellipse cx="0" cy="8" rx="100" ry="42" fill="#047857" />
              {/* Table Top Surface */}
              <ellipse cx="0" cy="0" rx="100" ry="42" fill="url(#loadGrad)" stroke="#065f46" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="12" fill="#1e293b" />
              <text x="0" y="-12" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ROTARY TABLE
              </text>
              <text x="0" y="20" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                LOAD MASS: {massKg} kg
              </text>
            </g>

            {/* Rotation Direction Arrow (Circular) */}
            <path d="M 320,60 A 60 25 0 0 1 420,60" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 3" />
            <polygon points="423,60 415,55 416,65" fill="#2563eb" />
            <text x="370" y="48" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
              ω (회전 구동) | 감속비 {gearRatio}:1
            </text>
          </>
        );

      default:
        return null;
    }
  };

  const isBallScrewH = mechanismType === 'ballscrew_h';

  return (
    <div className="card visualizer-card">
      <div className="card-header border-purple">
        <div className="card-title">
          <ImageIcon size={18} className="text-purple" />
          <h2>{getMechanismTitle()}</h2>
        </div>
      </div>

      <div className="card-body viz-body">
        {isBallScrewH ? (
          <div className="viz-3d-wrapper">
            <div className="viz-img-container large-view">
              <img
                src={ballscrewHImg}
                alt="Horizontal BallScrew Assembly 3D Diagram"
                className="viz-3d-img large-img"
              />
              {/* Dynamic Live Parameter Overlays matching key parts */}
              <div className="viz-overlay-badge badge-motor">
                <span className="badge-title">MOTOR</span>
                <span className="badge-val">{motorModel}</span>
              </div>
              <div className="viz-overlay-badge badge-load">
                <span className="badge-title">CARRIAGE LOAD (M)</span>
                <span className="badge-val">{massKg} kg</span>
              </div>
              <div className="viz-overlay-badge badge-thrust">
                <span className="badge-title">F_THRUST</span>
                <span className="badge-val">{thrustForce} N</span>
              </div>
              <div className="viz-overlay-badge badge-ballscrew">
                <span className="badge-title">BALL SCREW</span>
                <span className="badge-val">Lead {leadMm}mm</span>
              </div>
            </div>
          </div>
        ) : (
          <svg viewBox="0 0 560 190" className="viz-svg">
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

            {renderDiagramContent()}
          </svg>
        )}

        <div className="viz-metrics font-mono">
          <span>기구 종류: {mechanismType}</span>
          <span>부하 질량: {massKg} kg</span>
          {mechanismType.startsWith('ballscrew') && <span>스크류 리드: {leadMm} mm</span>}
          {(mechanismType === 'belt_h' || mechanismType === 'rack_pinion') && <span>풀리/피니언 지름: {pulleyDiaMm} mm</span>}
          {mechanismType === 'rotary' && <span>감속비: {gearRatio} : 1</span>}
          <span>목표 최고속도: {inputs.maxVelocity} m/s</span>
        </div>
      </div>
    </div>
  );
}


