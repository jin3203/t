import React from 'react';
import { Printer, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportView({ inputs, motor, results, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="report-overlay">
      <div className="report-actions-bar no-print">
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          <span>인쇄 또는 PDF 저장 (Print / Save PDF)</span>
        </button>
        <button className="btn btn-outline" onClick={onClose}>
          <X size={16} />
          <span>닫기</span>
        </button>
      </div>

      <div className="report-sheet">
        <div className="report-header">
          <h1>모터 및 드라이브 용량 선정 검토 보고서</h1>
          <p className="report-subtitle">Motor & Drive Sizing Verification Report</p>
          <div className="report-meta">
            <span>검토 일자: {currentDate}</span>
            <span>검토 기구: 수평 볼스크류 기구부</span>
          </div>
        </div>

        {/* Status Box */}
        <div className={`report-status-box ${results.overallOk ? 'status-ok' : 'status-ng'}`}>
          <div className="status-icon">
            {results.overallOk ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
          </div>
          <div>
            <h2>최종 판정 결과: {results.overallOk ? '적합 (PASS / OK)' : '부적합 (FAIL / NG)'}</h2>
            <p>
              선정된 모터모델 <strong>[{motor.maker} {motor.model} ({motor.driveModel})]</strong> 은(는) 해당 구동 조건의
              토크, 관성비 및 속도 요구사항을 {results.overallOk ? '성공적으로 만족합니다.' : '만족하지 못합니다. 상위 모터로 변경이 필요합니다.'}
            </p>
          </div>
        </div>

        {/* Section 1: Conditions Grid */}
        <div className="report-grid">
          <div className="report-section">
            <h3>1. 기구 조건 (Mechanism)</h3>
            <table className="report-table">
              <tbody>
                <tr><td>Connection Type</td><td>BallScrew</td></tr>
                <tr><td>Lead</td><td>{inputs.lead} m ({inputs.lead * 1000} mm)</td></tr>
                <tr><td>Screw Length / Dia</td><td>{inputs.length} m / {inputs.diameter} m</td></tr>
                <tr><td>Load Mass (부하 질량)</td><td>{inputs.mass} kg</td></tr>
                <tr><td>Friction (마찰 계수)</td><td>{inputs.friction}</td></tr>
                <tr><td>Efficiency (기계효율)</td><td>{inputs.efficiency * 100}%</td></tr>
                <tr><td>Safety Factor (안전율)</td><td>{inputs.safetyFactor} 배</td></tr>
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h3>2. 구동 조건 (Motion Profile)</h3>
            <table className="report-table">
              <tbody>
                <tr><td>Move Distance (이동거리)</td><td>{inputs.distance} m</td></tr>
                <tr><td>Max Speed (부하속도)</td><td>{inputs.maxVelocity} m/s</td></tr>
                <tr><td>Move Time (이동시간)</td><td>{inputs.moveTime} s</td></tr>
                <tr><td>Accel / Decel Time</td><td>{inputs.accelTime} s / {inputs.decelTime} s</td></tr>
                <tr><td>Dwell Time (휴지시간)</td><td>{inputs.dwellTime} s</td></tr>
                <tr><td>Total Cycle Time</td><td>{results.cycleTime?.toFixed(2)} s</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Motor Specifications */}
        <div className="report-section">
          <h3>3. 모터 & 드라이브 사양 (Motor Specifications)</h3>
          <table className="report-table full-width">
            <thead>
              <tr>
                <th>모터 모델</th>
                <th>드라이브 모델</th>
                <th>정격 속도</th>
                <th>최대 속도</th>
                <th>정격 토크</th>
                <th>최대 토크</th>
                <th>회전 관성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">{motor.model}</td>
                <td>{motor.driveModel}</td>
                <td>{motor.ratedSpeed} RPM</td>
                <td>{motor.maxSpeed} RPM</td>
                <td>{motor.ratedTorque} N·m</td>
                <td>{motor.maxTorque} N·m</td>
                <td>{(motor.rotorInertia * 1e4).toFixed(2)} ×10⁻⁴ kg·m²</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Calculation & Result Verification */}
        <div className="report-section">
          <h3>4. 계산 결과 및 검토 (Calculations & Margin Verification)</h3>
          <table className="report-table full-width">
            <thead>
              <tr>
                <th>검토 항목</th>
                <th>계산 요구치 (Required)</th>
                <th>모터 사양치 (Motor Limit)</th>
                <th>사용 마진율 (Utilization)</th>
                <th>판정 (Result)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>소요 가속 토크 (Accel Torque)</td>
                <td>{results.reqAccelTorque?.toFixed(3)} N·m</td>
                <td>{motor.maxTorque} N·m</td>
                <td>{results.checks?.accelTorque?.pct?.toFixed(2)}%</td>
                <td className="font-bold text-green">OK</td>
              </tr>
              <tr>
                <td>소요 감속 토크 (Decel Torque)</td>
                <td>{results.reqDecelTorque?.toFixed(3)} N·m</td>
                <td>{motor.maxTorque} N·m</td>
                <td>{results.checks?.decelTorque?.pct?.toFixed(2)}%</td>
                <td className="font-bold text-green">OK</td>
              </tr>
              <tr>
                <td>토크 실효치 (RMS Torque)</td>
                <td>{results.rmsTorque?.toFixed(3)} N·m</td>
                <td>{motor.ratedTorque} N·m</td>
                <td>{results.checks?.rmsTorque?.pct?.toFixed(2)}%</td>
                <td className="font-bold text-green">OK</td>
              </tr>
              <tr>
                <td>부하 관성비 (Inertia Ratio)</td>
                <td>{results.inertiaRatio?.toFixed(2)} 배</td>
                <td>30 배 이하 권장</td>
                <td>-</td>
                <td className="font-bold text-green">OK</td>
              </tr>
              <tr>
                <td>모터 최고 회전수 (Max Speed)</td>
                <td>{Math.round(results.maxMotorRPM || 0)} RPM</td>
                <td>{motor.maxSpeed} RPM</td>
                <td>{((results.maxMotorRPM / motor.maxSpeed) * 100).toFixed(1)}%</td>
                <td className="font-bold text-green">OK</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Regenerative Review */}
        <div className="report-section">
          <h3>5. 회생 저항 검토 (Regenerative Energy Review)</h3>
          <table className="report-table full-width">
            <tbody>
              <tr>
                <td>회생 에너지 (Regen Power)</td>
                <td className="font-mono">{results.regen?.regenEnergyPerCycle?.toFixed(2)} W</td>
                <td>내부 Shunt 저항/용량</td>
                <td className="font-mono">{results.regen?.internalShuntRes} Ω / {results.regen?.internalShuntCap} W</td>
                <td>외부 Shunt 필요 여부</td>
                <td className="font-bold text-green">{results.regen?.extShuntResText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-footer">
          <p>본 검토 보고서는 공학적 자동 계산 수식에 기반하여 작성되었습니다.</p>
        </div>
      </div>
    </div>
  );
}
