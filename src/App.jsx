import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MechanismInputs from './components/MechanismInputs';
import MotionInputs from './components/MotionInputs';
import MotorSelect from './components/MotorSelect';
import CalculationResults from './components/CalculationResults';
import EvaluationCheck from './components/EvaluationCheck';
import RegenerationCheck from './components/RegenerationCheck';
import MotionProfileGraph from './components/MotionProfileGraph';
import TorqueProfileGraph from './components/TorqueProfileGraph';
import MechanismVisualizer from './components/MechanismVisualizer';
import FormulaModal from './components/FormulaModal';
import AddMotorModal from './components/AddMotorModal';
import RawDataModal from './components/RawDataModal';
import ReportView from './components/ReportView';
import ProgressBarModal from './components/ProgressBarModal';
import ErrorBoundary from './components/ErrorBoundary';

import { MOTOR_PRESETS } from './data/motorPresets';
import { calculateMotorSizing } from './utils/motorCalculations';
import { ArrowRight, ArrowLeft, RotateCcw, Download, Sparkles } from 'lucide-react';

const DEFAULT_INPUTS = {
  mechanismType: 'ballscrew_h',
  lead: 0.02,
  length: 1.4,
  diameter: 0.02,
  mass: 8.0,
  friction: 0.2,
  thrustForce: 0.0,
  efficiency: 0.8,
  safetyFactor: 1.2,
  addInertia: 0.0,
  gearRatio: 1.0,
  densityMaterial: 'Steel',
  density: 7870,
  pulleyDiameter: 0.05,

  // Motion Profile
  distance: 1.1,
  profileType: 'speed',
  maxVelocity: 0.5,
  moveTime: 2.0,
  accelTime: 0.5,
  decelTime: 0.5,
  dwellTime: 1.0
};

const LOCAL_STORAGE_CUSTOM_MOTORS = 'motor_sizing_custom_motors_v1';
const LOCAL_STORAGE_ADDRESS = 'motor_sizing_location_address_v1';

export default function App() {
  const [mechanismType, setMechanismType] = useState('ballscrew_h');
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  // View state: 'input' (main input screen) | 'results' (results review screen)
  const [viewMode, setViewMode] = useState('input');
  // Calculation progress modal
  const [isCalculating, setIsCalculating] = useState(false);

  // Address state for confirmation location
  const [locationAddress, setLocationAddress] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_ADDRESS) || '서울특별시 금천구 가산디지털1로 168 (엔지니어링 센터)';
    } catch {
      return '서울특별시 금천구 가산디지털1로 168 (엔지니어링 센터)';
    }
  });

  const handleUpdateAddress = (newAddr) => {
    setLocationAddress(newAddr);
    try {
      localStorage.setItem(LOCAL_STORAGE_ADDRESS, newAddr);
    } catch (e) {
      console.error('Failed to save address:', e);
    }
  };

  // Motor catalog state
  const [motorCatalog, setMotorCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_MOTORS);
      if (saved) {
        const customMotors = JSON.parse(saved);
        return [...MOTOR_PRESETS, ...customMotors];
      }
    } catch (e) {
      console.error('Failed to load custom motors:', e);
    }
    return MOTOR_PRESETS;
  });

  const [motor, setMotor] = useState(MOTOR_PRESETS.find(p => p.id === 'CSMA_04B') || MOTOR_PRESETS[0]);

  // Modals
  const [showFormulas, setShowFormulas] = useState(false);
  const [showAddMotor, setShowAddMotor] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Sync mechanism tab with inputs
  const handleMechanismChange = (type) => {
    setMechanismType(type);
    setInputs((prev) => ({ ...prev, mechanismType: type }));
  };

  const handleResetDefaults = () => {
    setMechanismType('ballscrew_h');
    setInputs(DEFAULT_INPUTS);
    setMotor(MOTOR_PRESETS.find(p => p.id === 'CSMA_04B') || MOTOR_PRESETS[0]);
    setViewMode('input');
  };

  const handleSaveMotor = (newMotor) => {
    setMotorCatalog((prev) => {
      const updated = [newMotor, ...prev];
      try {
        const customOnly = updated.filter(m => m.id.startsWith('CUSTOM_'));
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_MOTORS, JSON.stringify(customOnly));
      } catch (e) {
        console.error('Failed to save custom motor:', e);
      }
      return updated;
    });
    setMotor(newMotor);
  };

  const handleUpdateCatalog = (newCatalog) => {
    setMotorCatalog(newCatalog);
    if (newCatalog.length > 0) {
      setMotor(newCatalog[0]);
    }
    try {
      const customOnly = newCatalog.filter(m => m.id.startsWith('CUSTOM_'));
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_MOTORS, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save catalog:', e);
    }
  };

  // Perform calculations dynamically with error protection
  const results = useMemo(() => {
    try {
      return calculateMotorSizing({
        ...inputs,
        mechanismType,
        motor
      });
    } catch (e) {
      console.error("Calculation Error:", e);
      return calculateMotorSizing({
        ...DEFAULT_INPUTS,
        mechanismType: 'ballscrew_h',
        motor: MOTOR_PRESETS[0]
      });
    }
  }, [inputs, mechanismType, motor]);

  // Trigger result check with progress bar
  const handleCheckResultsClick = () => {
    setIsCalculating(true);
  };

  const handleProgressComplete = () => {
    setIsCalculating(false);
    setViewMode('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Top Navigation Header */}
      <Header
        mechanismType={mechanismType}
        setMechanismType={handleMechanismChange}
        locationAddress={locationAddress}
        onUpdateAddress={handleUpdateAddress}
        onResetDefaults={handleResetDefaults}
        onOpenFormulas={() => setShowFormulas(true)}
        onOpenRawData={() => setShowRawData(true)}
        onExportReport={() => setShowReport(true)}
      />

      <ErrorBoundary>
        {/* Main Workspace View */}
        <main className="dashboard-content">
          {viewMode === 'input' ? (
            /* ============================================================ */
            /* SCREEN 1: Entire Input & Motion Profile Screen              */
            /* ============================================================ */
            <div className="view-container input-view-container">
              {/* Row 1: Mechanism Conditions, Motion Conditions, Motion Profile Graph */}
              <div className="grid-3col">
                <MechanismInputs
                  inputs={inputs}
                  setInputs={setInputs}
                  mechanismType={mechanismType}
                />
                <MotionInputs
                  inputs={inputs}
                  setInputs={setInputs}
                  results={results}
                />
                <MotionProfileGraph
                  points={results.profilePoints}
                />
              </div>

              {/* Row 2: Motor/Driver Selection, Mechanism Visualizer */}
              <div className="grid-2col margin-top">
                <MotorSelect
                  motor={motor}
                  setMotor={setMotor}
                  motorCatalog={motorCatalog}
                  onOpenAddMotor={() => setShowAddMotor(true)}
                />
                <MechanismVisualizer
                  inputs={{ ...inputs, motorModel: motor.model }}
                  results={results}
                  mechanismType={mechanismType}
                />
              </div>

              {/* Row 3: Prominent "결과 확인" Action CTA Button */}
              <div className="action-cta-banner margin-top">
                <div className="cta-content">
                  <div className="cta-icon">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h3>입력한 조건으로 모터 용량 정밀 검토 실행</h3>
                    <p>기구 파라미터, 속도 프로파일, 모터 사양을 기반으로 가/감속 및 RMS 토크, 회생 저항을 검토합니다.</p>
                  </div>
                </div>
                <button
                  className="btn-cta-submit"
                  onClick={handleCheckResultsClick}
                >
                  <span>결과 확인</span>
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* SCREEN 2: Calculation Results, Checks, & Torque Graph Screen */
            /* ============================================================ */
            <div className="view-container results-view-container">
              {/* Sub Header / Action Toolbar for Results Screen */}
              <div className="results-sub-header">
                <div className="sub-header-title">
                  <button
                    className="btn btn-outline"
                    onClick={() => setViewMode('input')}
                  >
                    <ArrowLeft size={18} />
                    <span>← 입력 조건 수정하기</span>
                  </button>
                  <h2>모터 용량 선정 계산 및 최종 검토 결과</h2>
                </div>
                <div className="sub-header-actions">
                  <button className="btn btn-outline" onClick={handleCheckResultsClick}>
                    <RotateCcw size={16} />
                    <span>결과 재검토 (Re-check)</span>
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowReport(true)}>
                    <Download size={16} />
                    <span>검토 보고서 (Print/PDF)</span>
                  </button>
                </div>
              </div>

              {/* Top 3 Result Columns: Calculation Results, Review Check, Regeneration Check */}
              <div className="grid-3col margin-top">
                <CalculationResults results={results} />
                <EvaluationCheck results={results} />
                <RegenerationCheck regen={results.regen} />
              </div>

              {/* Bottom Section: Calculated Torque Profile Graph */}
              <TorqueProfileGraph
                points={results.profilePoints}
                results={results}
                motor={motor}
              />
            </div>
          )}
        </main>
      </ErrorBoundary>

      {/* Progress Bar Loading Modal */}
      <ProgressBarModal
        isOpen={isCalculating}
        onComplete={handleProgressComplete}
      />

      {/* Formula Info Modal */}
      <FormulaModal
        isOpen={showFormulas}
        onClose={() => setShowFormulas(false)}
      />

      {/* Add Custom Motor Spec Modal */}
      <AddMotorModal
        isOpen={showAddMotor}
        onClose={() => setShowAddMotor(false)}
        onSaveMotor={handleSaveMotor}
      />

      {/* Raw Data JSON Editor & Backup Modal */}
      <RawDataModal
        isOpen={showRawData}
        onClose={() => setShowRawData(false)}
        motorCatalog={motorCatalog}
        onUpdateCatalog={handleUpdateCatalog}
      />

      {/* Printable Report Modal */}
      {showReport && (
        <ReportView
          inputs={inputs}
          motor={motor}
          results={results}
          locationAddress={locationAddress}
          onUpdateAddress={handleUpdateAddress}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
