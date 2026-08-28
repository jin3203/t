import React from 'react';
import { Cpu, PlusCircle } from 'lucide-react';

export default function MotorSelect({ motor, setMotor, motorCatalog, onOpenAddMotor }) {
  const handlePresetChange = (presetId) => {
    const found = motorCatalog.find((p) => p.id === presetId);
    if (found) {
      setMotor({ ...found });
    }
  };

  const handleFieldChange = (field, value) => {
    setMotor((prev) => ({
      ...prev,
      id: prev.id.startsWith('CUSTOM') ? prev.id : `CUSTOM_${Date.now()}`,
      maker: prev.maker || '사용자 지정',
      [field]: typeof value === 'string' ? value : parseFloat(value) || 0
    }));
  };

  // Group catalog by maker
  const groupedCatalog = motorCatalog.reduce((acc, item) => {
    const makerKey = item.maker || '기타';
    if (!acc[makerKey]) acc[makerKey] = [];
    acc[makerKey].push(item);
    return acc;
  }, {});

  return (
    <div className="card input-card">
      <div className="card-header border-green">
        <div className="card-title">
          <Cpu size={18} className="text-green" />
          <h2>* Motor / Drive Select / Info</h2>
        </div>
        <button
          className="btn btn-xs btn-outline"
          onClick={onOpenAddMotor}
          title="새로운 모터 사양 데이터 추가"
          style={{ borderColor: '#86efac', background: '#f0fdf4', color: '#166534' }}
        >
          <PlusCircle size={14} />
          <span>+ 사양 추가</span>
        </button>
      </div>

      <div className="card-body">
        <table className="excel-table input-table">
          <tbody>
            <tr>
              <td className="field-label">모터 모델 (Motor Model)</td>
              <td className="field-value highlight-cell" colSpan={2}>
                <select
                  value={motor.id}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="excel-select font-bold"
                >
                  {Object.entries(groupedCatalog).map(([maker, list]) => (
                    <optgroup key={maker} label={`--- ${maker} ---`}>
                      {list.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.model} ({p.powerW}W / {Number(p.ratedTorque).toFixed(2)}Nm)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className="field-label">브레이크 유무 (Brake)</td>
              <td className="field-value highlight-cell">
                <select
                  value={motor.brake}
                  onChange={(e) => handleFieldChange('brake', parseInt(e.target.value, 10))}
                  className="excel-select text-center"
                >
                  <option value={1}>1 (유)</option>
                  <option value={0}>0 (무)</option>
                </select>
              </td>
              <td className="field-unit text-muted">&lt;- 유:1 무:0</td>
            </tr>

            <tr>
              <td className="field-label">드라이브 모델 (Drive)</td>
              <td className="field-value highlight-cell" colSpan={2}>
                <input
                  type="text"
                  value={motor.driveModel}
                  onChange={(e) => handleFieldChange('driveModel', e.target.value)}
                  className="font-bold text-center"
                />
              </td>
            </tr>

            <tr>
              <td className="field-label">정격속도 (Rated Speed)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="100"
                  value={motor.ratedSpeed}
                  onChange={(e) => handleFieldChange('ratedSpeed', e.target.value)}
                />
              </td>
              <td className="field-unit">RPM</td>
            </tr>

            <tr>
              <td className="field-label">최대속도 (Max Speed)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="100"
                  value={motor.maxSpeed}
                  onChange={(e) => handleFieldChange('maxSpeed', e.target.value)}
                />
              </td>
              <td className="field-unit">RPM</td>
            </tr>

            <tr>
              <td className="field-label">정격 토크 (Rated Torque)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.01"
                  value={motor.ratedTorque}
                  onChange={(e) => handleFieldChange('ratedTorque', e.target.value)}
                />
              </td>
              <td className="field-unit">[N·m]</td>
            </tr>

            <tr>
              <td className="field-label">최대 토크 (Max Torque)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.01"
                  value={motor.maxTorque}
                  onChange={(e) => handleFieldChange('maxTorque', e.target.value)}
                />
              </td>
              <td className="field-unit">[N·m]</td>
            </tr>

            <tr>
              <td className="field-label">회전 관성 (Rotor Inertia)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.01"
                  value={(motor.rotorInertia * 1e4).toFixed(2)}
                  onChange={(e) => handleFieldChange('rotorInertia', (parseFloat(e.target.value) || 0) * 1e-4)}
                />
              </td>
              <td className="field-unit">[kg·m²x10⁻⁴]</td>
            </tr>

            <tr>
              <td className="field-label">정격 전류 (Rated Current)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  value={motor.ratedCurrent}
                  onChange={(e) => handleFieldChange('ratedCurrent', e.target.value)}
                />
              </td>
              <td className="field-unit">Arms</td>
            </tr>

            <tr>
              <td className="field-label">최대 전류 (Max Current)</td>
              <td className="field-value highlight-cell">
                <input
                  type="number"
                  step="0.1"
                  value={motor.maxCurrent}
                  onChange={(e) => handleFieldChange('maxCurrent', e.target.value)}
                />
              </td>
              <td className="field-unit">Arms</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
