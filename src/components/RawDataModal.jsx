import React, { useState, useEffect } from 'react';
import { X, FileCode, Download, Upload, Check, AlertCircle } from 'lucide-react';

export default function RawDataModal({ isOpen, onClose, motorCatalog, onUpdateCatalog }) {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(motorCatalog, null, 2));
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, motorCatalog]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('모터 데이터는 배열 형태 [ ... ] 여야 합니다.');
      }
      onUpdateCatalog(parsed);
      setSuccessMsg('Raw 데이터가 성공적으로 반영 및 저장되었습니다.');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(`JSON 형식 오류: ${err.message}`);
      setSuccessMsg('');
    }
  };

  const handleExportFile = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `motor_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('올바른 모터 데이터 배열이 아닙니다.');
        }
        setJsonText(JSON.stringify(parsed, null, 2));
        setSuccessMsg('파일을 성공적으로 불러왔습니다. 하단 [적용 및 저장]을 누르세요.');
        setErrorMsg('');
      } catch (err) {
        setErrorMsg(`파일 읽기 오류: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <div className="card-header border-purple">
          <div className="card-title">
            <FileCode size={20} className="text-purple" />
            <h2>모터 카탈로그 Raw 데이터 편집 및 백업 (JSON Editor)</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body font-sans">
          <p className="subtitle" style={{ marginBottom: '0.75rem' }}>
            모터 사양 전체 Raw 데이터를 JSON 포맷으로 직접 수정하거나, <code>.json</code> 파일로 내보내기/불러오기를 진행할 수 있습니다.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button className="btn btn-outline btn-xs" onClick={handleExportFile}>
              <Download size={14} />
              <span>JSON 파일 다운로드 (내보내기)</span>
            </button>
            <label className="btn btn-outline btn-xs" style={{ cursor: 'pointer' }}>
              <Upload size={14} />
              <span>JSON 파일 불러오기</span>
              <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
            </label>
          </div>

          {errorMsg && (
            <div className="overall-banner banner-ng" style={{ marginBottom: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="overall-banner banner-ok" style={{ marginBottom: '0.5rem' }}>
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="font-mono"
            style={{
              width: '100%',
              height: '350px',
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '0.8rem',
              lineHeight: '1.4',
              resize: 'vertical'
            }}
          />
        </div>

        <div className="modal-footer" style={{ gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={onClose}>
            닫기
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>적용 및 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
