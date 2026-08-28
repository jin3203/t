import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function AddMotorModal({ isOpen, onClose, onSaveMotor }) {
  const [form, setForm] = useState({
    maker: 'LS Electric',
    model: '',
    driveModel: '',
    powerW: 400,
    ratedSpeed: 3000,
    maxSpeed: 6000,
    ratedTorque: 1.27,
    maxTorque: 4.46,
    rotorInertia10x4: 0.35, // display in 10^-4
    ratedCurrent: 2.8,
    maxCurrent: 9.5,
    brake: 1,
    recommendedMaxInertiaRatio: 30
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? value : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.model.trim()) {
      alert('모터 모델명을 입력해주세요.');
      return;
    }

    const power = parseFloat(form.powerW) || 400;

    const newMotor = {
      id: `CUSTOM_${Date.now()}`,
      maker: form.maker.trim() || '사용자 지정',
      model: form.model.trim(),
      driveModel: form.driveModel.trim() || `${power}W Drive`,
      powerW: power,
      ratedSpeed: parseFloat(form.ratedSpeed) || 3000,
      maxSpeed: parseFloat(form.maxSpeed) || 6000,
      ratedTorque: parseFloat(form.ratedTorque) || 1.27,
      maxTorque: parseFloat(form.maxTorque) || 4.46,
      rotorInertia: (parseFloat(form.rotorInertia10x4) || 0.35) * 1e-4,
      ratedCurrent: parseFloat(form.ratedCurrent) || 2.8,
      maxCurrent: parseFloat(form.maxCurrent) || 9.5,
      brake: parseInt(form.brake, 10),
      internalShuntRes: 50,
      internalShuntCap: power >= 750 ? 50 : 30,
      recommendedMaxInertiaRatio: parseFloat(form.recommendedMaxInertiaRatio) || 30
    };

    onSaveMotor(newMotor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="card-header border-green">
          <div className="card-title">
            <PlusCircle size={20} className="text-green" />
            <h2>신규 모터 사양 등록 (Register Custom Motor)</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body font-sans">
            <table className="excel-table input-table">
              <tbody>
                <tr>
                  <td className="field-label">제조사 (Maker)</td>
                  <td className="field-value highlight-cell" colSpan={2}>
                    <input
                      type="text"
                      placeholder="예: LS Electric, Mitsubishi, Oriental"
                      value={form.maker}
                      onChange={(e) => handleChange('maker', e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="field-label">모터 모델명 (Model) *</td>
                  <td className="field-value highlight-cell" colSpan={2}>
                    <input
                      type="text"
                      placeholder="예: APM-FEP04D"
                      value={form.model}
                      required
                      onChange={(e) => handleChange('model', e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="field-label">드라이브 모델명</td>
                  <td className="field-value highlight-cell" colSpan={2}>
                    <input
                      type="text"
                      placeholder="예: L7N004U"
                      value={form.driveModel}
                      onChange={(e) => handleChange('driveModel', e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="field-label">정격 용량 (Power)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="50"
                      value={form.powerW}
                      onChange={(e) => handleChange('powerW', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">W</td>
                </tr>

                <tr>
                  <td className="field-label">정격 속도 (Rated Speed)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="100"
                      value={form.ratedSpeed}
                      onChange={(e) => handleChange('ratedSpeed', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">RPM</td>
                </tr>

                <tr>
                  <td className="field-label">최대 속도 (Max Speed)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="100"
                      value={form.maxSpeed}
                      onChange={(e) => handleChange('maxSpeed', parseFloat(e.target.value))}
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
                      value={form.ratedTorque}
                      onChange={(e) => handleChange('ratedTorque', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">N·m</td>
                </tr>

                <tr>
                  <td className="field-label">최대 토크 (Max Peak Torque)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.01"
                      value={form.maxTorque}
                      onChange={(e) => handleChange('maxTorque', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">N·m</td>
                </tr>

                <tr>
                  <td className="field-label">회전 관성 (Rotor Inertia)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.01"
                      value={form.rotorInertia10x4}
                      onChange={(e) => handleChange('rotorInertia10x4', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">×10⁻⁴ kg·m²</td>
                </tr>

                <tr>
                  <td className="field-label">정격 전류 (Rated Current)</td>
                  <td className="field-value highlight-cell">
                    <input
                      type="number"
                      step="0.1"
                      value={form.ratedCurrent}
                      onChange={(e) => handleChange('ratedCurrent', parseFloat(e.target.value))}
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
                      value={form.maxCurrent}
                      onChange={(e) => handleChange('maxCurrent', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="field-unit">Arms</td>
                </tr>

                <tr>
                  <td className="field-label">브레이크 유무 (Brake)</td>
                  <td className="field-value highlight-cell" colSpan={2}>
                    <select
                      value={form.brake}
                      onChange={(e) => handleChange('brake', parseInt(e.target.value, 10))}
                      className="excel-select"
                    >
                      <option value={1}>1 (브레이크 있음)</option>
                      <option value={0}>0 (브레이크 없음)</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal-footer" style={{ gap: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>모터 등록 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
