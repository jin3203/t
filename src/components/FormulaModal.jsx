import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';

export default function FormulaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header border-blue">
          <div className="card-title">
            <BookOpen size={20} className="text-blue" />
            <h2>모터 선정 수식 및 이론 정리 (Engineering Math Guide)</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body font-sans">
          <section className="formula-section">
            <h3>1. 관성 모멘트 (Inertia Calculation)</h3>
            <div className="formula-box font-mono">
              <p>볼스크류 관성 J_screw = (π / 32) × ρ × L × D⁴ [kg·m²]</p>
              <p>부하 직선 관성 J_mass = M × (P / 2π)² [kg·m²]</p>
              <p>모터 축 환산 총 부하 관성 J_L = (J_screw + J_mass) / R² + J_add [kg·m²]</p>
              <p>관성비 (Inertia Ratio) = J_L / J_m (권장: 10~30배 이하)</p>
            </div>
          </section>

          <section className="formula-section">
            <h3>2. 이동 속도 및 모터 회전수 (Velocity & RPM)</h3>
            <div className="formula-box font-mono">
              <p>모터 최대 회전수 N_motor = (v_max / Lead) × 60 × R [RPM]</p>
              <p>각속도 ω = (2π × N_motor) / 60 [rad/sec]</p>
              <p>각가속도 α = ω / t_a [rad/sec²]</p>
            </div>
          </section>

          <section className="formula-section">
            <h3>3. 소요 토크 (Torque Requirements)</h3>
            <div className="formula-box font-mono">
              <p>등속 항속 부하 토크 T_L = (F_thrust × Lead) / (2π × η × R) [N·m]</p>
              <p>가속 토크 T_a = (J_total × α × S) + T_L [N·m]</p>
              <p>감속 토크 T_d = (-J_total × α × S) + T_L [N·m]</p>
              <p>실효 토크 T_rms = √ [ (T_a²·t_a + T_L²·t_c + T_d²·t_d) / t_cycle ] [N·m]</p>
            </div>
          </section>

          <section className="formula-section">
            <h3>4. 결과 검토 기준 (Check Criteria)</h3>
            <ul className="check-list">
              <li><Check size={16} className="text-green" /> 가속 토크 조건: T_a ≤ 모터 최대 토크 (T_max)</li>
              <li><Check size={16} className="text-green" /> 감속 토크 조건: |T_d| ≤ 모터 최대 토크 (T_max)</li>
              <li><Check size={16} className="text-green" /> 실효 토크 조건: T_rms ≤ 모터 정격 토크 (T_rated)</li>
              <li><Check size={16} className="text-green" /> 속도 조건: N_motor ≤ 모터 최대 회전수 (N_max)</li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
