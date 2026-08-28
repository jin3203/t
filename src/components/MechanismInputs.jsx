import React from 'react';
import { Settings, Info } from 'lucide-react';
import { MATERIAL_DENSITIES } from '../data/motorPresets';

export default function MechanismInputs({ inputs, setInputs, mechanismType }) {
  const handleChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value : parseFloat(value) || 0
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
            <tr>
              <td className="field-label">Connection Type</td>
              <td className="field-value highlight-cell" colSpan={2}>
                <select
                  value={mechanismType}
                  onChange={(e) => handleChange('mechanismType', e.target.value)}
                  className="excel-select"
                >
                  <option value="ballscrew_h">BallScrew (수평)</option>
                  <option value="ballscrew_v">BallScrew (수직)</option>
                  <option value="belt_h">Belt & Pulley (수평)</option>
                  <option value="rack_pinion">Rack & Pinion</option>
                  <option value="rotary">Rotary Table</option>
                </select>
              </td>
            </tr>

            {isBallScrew && (
              <>
                <tr>
                  <td className="field-label">BallScrew Lead</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.001"
                      value={inputs.lead}
                      onChange={(e) => handleChange('lead', e.target.value)}
                    />
                  </td>
                  <td className="field-unit">m ({inputs.lead * 1000} mm)</td>
                </tr>

                <tr>
                  <td className="field-label">BallScrew 길이</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.length}
                      onChange={(e) => handleChange('length', e.target.value)}
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
                      value={inputs.diameter}
                      onChange={(e) => handleChange('diameter', e.target.value)}
                    />
                  </td>
                  <td className="field-unit">m ({inputs.diameter * 1000} mm)</td>
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
                    value={inputs.pulleyDiameter}
                    onChange={(e) => handleChange('pulleyDiameter', e.target.value)}
                  />
                </td>
                <td className="field-unit">m ({inputs.pulleyDiameter * 1000} mm)</td>
              </tr>
            )}

            <tr>
              <td className="field-label">부하 질량 (Load Mass)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.5"
                  value={inputs.mass}
                  onChange={(e) => handleChange('mass', e.target.value)}
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
                  value={inputs.friction}
                  onChange={(e) => handleChange('friction', e.target.value)}
                />
              </td>
              <td className="field-unit">$\mu$</td>
            </tr>

            <tr>
              <td className="field-label">Thrust Force (추진력/추가력)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="1"
                  value={inputs.thrustForce}
                  onChange={(e) => handleChange('thrustForce', e.target.value)}
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
                  value={inputs.efficiency}
                  onChange={(e) => handleChange('efficiency', e.target.value)}
                />
              </td>
              <td className="field-unit">$\eta$ ({Math.round(inputs.efficiency * 100)}%)</td>
            </tr>

            <tr>
              <td className="field-label">안전률 (Safety Factor)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  value={inputs.safetyFactor}
                  onChange={(e) => handleChange('safetyFactor', e.target.value)}
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
                  value={inputs.addInertia}
                  onChange={(e) => handleChange('addInertia', e.target.value)}
                />
              </td>
              <td className="field-unit">Kgm^2</td>
            </tr>

            <tr>
              <td className="field-label">감속비 (Reduction Ratio)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inputs.gearRatio}
                  onChange={(e) => handleChange('gearRatio', e.target.value)}
                />
              </td>
              <td className="field-unit">: 1</td>
            </tr>

            <tr>
              <td className="field-label">Connection 밀도 (재질)</td>
              <td className="field-value highlight-cell">
                <select
                  value={inputs.densityMaterial}
                  onChange={(e) => {
                    const matKey = e.target.value;
                    const den = MATERIAL_DENSITIES[matKey]?.density || 7870;
                    setInputs((prev) => ({
                      ...prev,
                      densityMaterial: matKey,
                      density: den
                    }));
                  }}
                  className="excel-select"
                >
                  {Object.entries(MATERIAL_DENSITIES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="field-unit">{inputs.density} kg/m³</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
