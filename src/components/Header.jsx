import React from 'react';
import { Cpu, RotateCcw, Download, HelpCircle, Layers, FileCode } from 'lucide-react';
import { MECHANISM_TYPES } from '../data/motorPresets';

export default function Header({
  mechanismType,
  setMechanismType,
  onResetDefaults,
  onOpenFormulas,
  onOpenRawData,
  onExportReport
}) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand">
          <div className="brand-icon">
            <Cpu size={24} />
          </div>
          <div>
            <h1>모터 용량 선정 및 검토 시스템</h1>
            <p className="subtitle">Motor & Drive Sizing Evaluation System</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-outline" onClick={onOpenRawData} title="모터 카탈로그 Raw 데이터 관리">
            <FileCode size={16} />
            <span>Raw 데이터 관리</span>
          </button>
          <button className="btn btn-outline" onClick={onOpenFormulas} title="계산식 보기">
            <HelpCircle size={16} />
            <span>수식 안내</span>
          </button>
          <button className="btn btn-outline" onClick={onResetDefaults} title="초기값 불러오기">
            <RotateCcw size={16} />
            <span>기본값 복원</span>
          </button>
          <button className="btn btn-primary" onClick={onExportReport} title="보고서 내보내기">
            <Download size={16} />
            <span>검토 보고서 (Print/PDF)</span>
          </button>
        </div>
      </div>

      <div className="mechanism-tabs">
        <div className="tab-label">
          <Layers size={16} />
          <span>기구 방식 선택:</span>
        </div>
        <div className="tabs-list">
          {MECHANISM_TYPES.map((mech) => (
            <button
              key={mech.id}
              className={`tab-btn ${mechanismType === mech.id ? 'active' : ''}`}
              onClick={() => setMechanismType(mech.id)}
            >
              {mech.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
