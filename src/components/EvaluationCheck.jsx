import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function EvaluationCheck({ results }) {
  const checks = results.checks || {
    accelTorque: { ok: true, pct: 14.62 },
    decelTorque: { ok: true, pct: -2.83 },
    rmsTorque: { ok: true, pct: 6.97 },
    inertiaRatio: { ok: true, val: 7.26 },
    maxSpeed: { ok: true, pct: 25.0 }
  };

  return (
    <div className="card check-card">
      <div className="card-header border-green">
        <div className="card-title">
          <CheckCircle2 size={18} className="text-green" />
          <h2>* 결과 검토 (Result_OK_NG / Check)</h2>
        </div>
      </div>

      <div className="card-body">
        <table className="excel-table check-table">
          <thead>
            <tr>
              <th className="text-center">항목 (Check Item)</th>
              <th className="text-center">Result_OK_NG</th>
              <th className="text-center">Check (마진율/여유율)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="field-label">가속 토크 검토 (Accel Torque)</td>
              <td className={`text-center font-bold status-cell ${checks.accelTorque.ok ? 'ok-badge' : 'ng-badge'}`}>
                {checks.accelTorque.ok ? 'OK' : 'NG'}
              </td>
              <td className="field-value font-mono text-center">
                {checks.accelTorque.pct !== undefined ? `${checks.accelTorque.pct.toFixed(2)}%` : '14.62%'}
              </td>
            </tr>

            <tr>
              <td className="field-label">감속 토크 검토 (Decel Torque)</td>
              <td className={`text-center font-bold status-cell ${checks.decelTorque.ok ? 'ok-badge' : 'ng-badge'}`}>
                {checks.decelTorque.ok ? 'OK' : 'NG'}
              </td>
              <td className="field-value font-mono text-center">
                {checks.decelTorque.pct !== undefined ? `${checks.decelTorque.pct.toFixed(2)}%` : '-2.83%'}
              </td>
            </tr>

            <tr>
              <td className="field-label">토크 실효치 검토 (RMS Torque)</td>
              <td className={`text-center font-bold status-cell ${checks.rmsTorque.ok ? 'ok-badge' : 'ng-badge'}`}>
                {checks.rmsTorque.ok ? 'OK' : 'NG'}
              </td>
              <td className="field-value font-mono text-center">
                {checks.rmsTorque.pct !== undefined ? `${checks.rmsTorque.pct.toFixed(2)}%` : '6.97%'}
              </td>
            </tr>

            <tr>
              <td className="field-label">관성비 검토 (Inertia Ratio)</td>
              <td className={`text-center font-bold status-cell ${checks.inertiaRatio.ok ? 'ok-badge' : 'ng-badge'}`}>
                {checks.inertiaRatio.ok ? 'OK' : 'NG'}
              </td>
              <td className="field-value font-mono text-center">*</td>
            </tr>

            <tr>
              <td className="field-label">최대 속도 검토 (Max Speed)</td>
              <td className={`text-center font-bold status-cell ${checks.maxSpeed.ok ? 'ok-badge' : 'ng-badge'}`}>
                {checks.maxSpeed.ok ? 'OK' : 'NG'}
              </td>
              <td className="field-value font-mono text-center">*</td>
            </tr>
          </tbody>
        </table>

        <div className={`overall-banner ${results.overallOk ? 'banner-ok' : 'banner-ng'}`}>
          {results.overallOk ? (
            <>
              <CheckCircle2 size={20} />
              <span>[최종 판정] 모터 및 드라이브 용량 선정 <strong>적합 (OK)</strong></span>
            </>
          ) : (
            <>
              <XCircle size={20} />
              <span>[최종 판정] 사양 미달 <strong>부적합 (NG)</strong> - 더 큰 상위 용량 모터를 선택하세요.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
