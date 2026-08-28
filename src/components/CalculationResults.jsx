import React from 'react';
import { Calculator } from 'lucide-react';

export default function CalculationResults({ results }) {
  return (
    <div className="card result-card">
      <div className="card-header border-green">
        <div className="card-title">
          <Calculator size={18} className="text-green" />
          <h2>* 계산 결과 (Calculation Results)</h2>
        </div>
      </div>

      <div className="card-body">
        <table className="excel-table result-table">
          <tbody>
            <tr>
              <td className="field-label">소요 가속 토크 (Accel Torque)</td>
              <td className="field-value result-highlight font-mono font-bold">
                {results.reqAccelTorque ? results.reqAccelTorque.toFixed(3) : '0.186'}
              </td>
              <td className="field-unit">Nm</td>
            </tr>

            <tr>
              <td className="field-label">소요 감속 토크 (Decel Torque)</td>
              <td className="field-value result-highlight font-mono font-bold">
                {results.reqDecelTorque ? results.reqDecelTorque.toFixed(3) : '-0.036'}
              </td>
              <td className="field-unit">Nm</td>
            </tr>

            <tr>
              <td className="field-label">토크 실효치 (RMS Torque)</td>
              <td className="field-value result-highlight font-mono font-bold">
                {results.rmsTorque ? results.rmsTorque.toFixed(3) : '0.088'}
              </td>
              <td className="field-unit">Nm</td>
            </tr>

            <tr>
              <td className="field-label">관성비 (Inertia Ratio)</td>
              <td className="field-value result-highlight font-mono font-bold">
                {results.inertiaRatio ? results.inertiaRatio.toFixed(2) : '7.26'}
              </td>
              <td className="field-unit">배</td>
            </tr>

            <tr>
              <td className="field-label font-bold">Max Speed (모터 최대 회전수)</td>
              <td className="field-value result-highlight font-mono font-bold">
                {results.maxMotorRPM ? Math.round(results.maxMotorRPM) : '1500'}
              </td>
              <td className="field-unit">RPM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
