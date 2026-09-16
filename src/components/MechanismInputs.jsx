import React from 'react';
import { Settings } from 'lucide-react';
import { MATERIAL_DENSITIES } from '../data/motorPresets';
import { handleEnterKeyNavigation } from '../utils/focusHelper';

export default function MechanismInputs({ inputs, setInputs, mechanismType }) {
  const handleChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const isBallScrew = mechanismType.startsWith('ballscrew');
  const isBelt = mechanismType === 'belt_h' || mechanismType === 'rack_pinion';

  return (
    <div className="card input-card">
      <div className="card-header border-green">
        <div className="card-title">
          <Settings size={18} className="text-green" />
          <h2>* 기구 조건 (Mechanism Conditions)</h2>
        </div>
      </div>

      <div className="card-body">
        <table className="excel-table input-table">
          <tbody>
            {isBallScrew && (
              <>
                <tr>
                  <td className="field-label">BallScrew Lead</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.001"
                      value={inputs.lead ?? 0.02}
                      onChange={(e) => handleChange('lead', e.target.value)}
                      onKeyDown={handleEnterKeyNavigation}
                    />
                  </td>
                  <td className="field-unit">m ({(Number(inputs.lead || 0) * 1000).toFixed(1)} mm)</td>
                </tr>

                <tr>
                  <td className="field-label">BallScrew 길이</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.length ?? 1.4}
                      onChange={(e) => handleChange('length', e.target.value)}
                      onKeyDown={handleEnterKeyNavigation}
                    />
                  </td>
                  <td className="field-unit">m</td>
                </tr>

                <tr>
                  <td className="field-label">BallScrew 직경</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.001"
                      value={inputs.diameter ?? 0.02}
                      onChange={(e) => handleChange('diameter', e.target.value)}
                      onKeyDown={handleEnterKeyNavigation}
                    />
                  </td>
                  <td className="field-unit">m ({(Number(inputs.diameter || 0) * 1000).toFixed(1)} mm)</td>
                </tr>
              </>
            )}

            {isBelt && (
              <tr>
                <td className="field-label">Pulley / Pinion 직경</td>
                <td className="field-value highlight-cell">
                  <input
                    type="number"
                    step="0.001"
                    value={inputs.pulleyDiameter ?? 0.05}
                    onChange={(e) => handleChange('pulleyDiameter', e.target.value)}
                    onKeyDown={handleEnterKeyNavigation}
                  />
                </td>
                <td className="field-unit">m ({(Number(inputs.pulleyDiameter || 0) * 1000).toFixed(1)} mm)</td>
              </tr>
            )}

            <tr>
              <td className="field-label">부하 질량 (Load Mass)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.5"
                  value={inputs.mass ?? 8.0}
                  onChange={(e) => handleChange('mass', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">Kg</td>
            </tr>

            <tr>
              <td className="field-label">마찰 계수 (Friction)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.01"
                  value={inputs.friction ?? 0.2}
                  onChange={(e) => handleChange('friction', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">μ</td>
            </tr>

            <tr>
              <td className="field-label">Thrust Force (추진력/추가력)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="1"
                  value={inputs.thrustForce ?? 0}
                  onChange={(e) => handleChange('thrustForce', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">N</td>
            </tr>

            <tr>
              <td className="field-label">기계효율 (Efficiency)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={inputs.efficiency ?? 0.8}
                  onChange={(e) => handleChange('efficiency', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">η ({Math.round((Number(inputs.efficiency) || 0) * 100)}%)</td>
            </tr>

            <tr>
              <td className="field-label">안전률 (Safety Factor)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  value={inputs.safetyFactor ?? 1.2}
                  onChange={(e) => handleChange('safetyFactor', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">배</td>
            </tr>

            <tr>
              <td className="field-label">추가 관성 (기어/커플링)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.0001"
                  value={inputs.addInertia ?? 0}
                  onChange={(e) => handleChange('addInertia', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">Kgm²</td>
            </tr>

            <tr>
              <td className="field-label">감속비 (Reduction Ratio)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inputs.gearRatio ?? 1.0}
                  onChange={(e) => handleChange('gearRatio', e.target.value)}
                  onKeyDown={handleEnterKeyNavigation}
                />
              </td>
              <td className="field-unit">: 1</td>
            </tr>

            <tr>
              <td className="field-label">기구 재질 (밀도)</td>
              <td className="field-value highlight-cell">
                <select
                  value={inputs.densityMaterial || 'Steel'}
                  onChange={(e) => {
                    const matKey = e.target.value;
                    const den = MATERIAL_DENSITIES[matKey]?.density || 7870;
                    setInputs((prev) => ({
                      ...prev,
                      densityMaterial: matKey,
                      density: den
                    }));
                  }}
                  onKeyDown={handleEnterKeyNavigation}
                  className="excel-select"
                >
                  {Object.entries(MATERIAL_DENSITIES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="field-unit">{inputs.density || 7870} kg/m³</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
