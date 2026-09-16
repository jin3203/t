import React from 'react';
import { Activity } from 'lucide-react';
import { handleEnterKeyNavigation } from '../utils/focusHelper';
import { safeFixed } from '../utils/motorCalculations';

export default function MotionInputs({ inputs, setInputs, results }) {
  const handleChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="card input-card">
      <div className="card-header border-green">
        <div className="card-title">
          <Activity size={18} className="text-green" />
          <h2>* 구동 조건 (Motion Conditions)</h2>
        </div>
      </div>

      <div className="card-body">
        <table className="excel-table input-table">
          <tbody>
            <tr>
              <td className="field-label">이동 거리 (Distance)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.distance ?? 1.1}
                  onChange={(e) => handleChange('distance', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">m ({(Number(inputs.distance || 0) * 1000).toFixed(0)} mm)</td>
            </tr>

            <tr>
              <td className="field-label">Profile Type</td>
              <td className="field-value highlight-cell" colSpan={2}>
                <select
                  value={inputs.profileType || 'speed'}
                  onChange={(e) => handleChange('profileType', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                  className="excel-select"
                >
                  <option value="speed">부하속도 지정 (Speed Based)</option>
                  <option value="time">이동시간 지정 (Time Based)</option>
                </select>
              </td>
            </tr>

            <tr>
              <td className="field-label">부하속도 (Max Speed) ▶</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.05"
                  value={inputs.maxVelocity ?? 0.5}
                  onChange={(e) => handleChange('maxVelocity', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">m/sec</td>
            </tr>

            <tr>
              <td className="field-label">이동시간 (Move Time) ▶</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.moveTime ?? 2.0}
                  onChange={(e) => handleChange('moveTime', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">sec</td>
            </tr>

            <tr>
              <td className="field-label">가속시간 (Accel Time)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.05"
                  value={inputs.accelTime ?? 0.5}
                  onChange={(e) => handleChange('accelTime', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">sec</td>
            </tr>

            <tr>
              <td className="field-label">감속시간 (Decel Time)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.05"
                  value={inputs.decelTime ?? 0.5}
                  onChange={(e) => handleChange('decelTime', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">sec</td>
            </tr>

            <tr>
              <td className="field-label">등속시간 (Const Speed)</td>
              <td className="field-value readonly-cell font-mono">
                {safeFixed(results?.constantTime, 3, '1.000')}
              </td>
              <td className="field-unit">sec</td>
            </tr>

            <tr>
              <td className="field-label">휴지시간 (Rest/Dwell Time)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.dwellTime ?? 1.0}
                  onChange={(e) => handleChange('dwellTime', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">sec</td>
            </tr>

            <tr>
              <td className="field-label font-bold">CycleTime (총 주기)</td>
              <td className="field-value readonly-cell font-mono font-bold">
                {safeFixed(results?.cycleTime, 2, '3.00')}
              </td>
              <td className="field-unit">sec</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
