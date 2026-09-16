import React, { useState } from 'react';
import { Cpu, RotateCcw, Download, HelpCircle, Layers, FileCode, MapPin, Edit2, Check } from 'lucide-react';
import { MECHANISM_TYPES } from '../data/motorPresets';

export default function Header({
  mechanismType,
  setMechanismType,
  locationAddress,
  onUpdateAddress,
  onResetDefaults,
  onOpenFormulas,
  onOpenRawData,
  onExportReport
}) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(locationAddress);

  const handleSaveAddress = () => {
    onUpdateAddress(tempAddress);
    setIsEditingAddress(false);
  };

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

        {/* Confirmation Address Bar */}
        <div className="address-bar-header">
          <MapPin size={15} className="text-blue" />
          <span className="address-label">확인 주소지:</span>
          {isEditingAddress ? (
            <div className="address-edit-box">
              <input
                type="text"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAddress();
                }}
                className="address-input"
                autoFocus
              />
              <button className="btn-icon-save" onClick={handleSaveAddress} title="저장">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div className="address-display-box" onClick={() => { setTempAddress(locationAddress); setIsEditingAddress(true); }}>
              <span className="address-val">{locationAddress}</span>
              <Edit2 size={12} className="edit-icon" title="주소지 변경/수정" />
            </div>
          )}
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
