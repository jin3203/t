import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MechanismInputs from './components/MechanismInputs';
import MotionInputs from './components/MotionInputs';
import MotorSelect from './components/MotorSelect';
import CalculationResults from './components/CalculationResults';
import EvaluationCheck from './components/EvaluationCheck';
import RegenerationCheck from './components/RegenerationCheck';
import MotionProfileGraph from './components/MotionProfileGraph';
import MechanismVisualizer from './components/MechanismVisualizer';
import FormulaModal from './components/FormulaModal';
import AddMotorModal from './components/AddMotorModal';
import RawDataModal from './components/RawDataModal';
import ReportView from './components/ReportView';

import { MOTOR_PRESETS } from './data/motorPresets';
import { calculateMotorSizing } from './utils/motorCalculations';

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

export default function App() {
  const [mechanismType, setMechanismType] = useState('ballscrew_h');
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  // Motor catalog state (Preset list + localStorage saved custom motors)
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

  // Modals & Views
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
  };

  // Add custom motor handler
  const handleSaveMotor = (newMotor) => {
    setMotorCatalog((prev) => {
      const updated = [newMotor, ...prev];
      try {
        const customOnly = updated.filter(m => m.id.startsWith('CUSTOM_'));
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_MOTORS, JSON.stringify(customOnly));
      } catch (e) {
        console.error('Failed to save custom motor to localStorage:', e);
      }
      return updated;
    });
    setMotor(newMotor);
  };

  // Raw data direct update handler
  const handleUpdateCatalog = (newCatalog) => {
    setMotorCatalog(newCatalog);
    if (newCatalog.length > 0) {
      setMotor(newCatalog[0]);
    }
    try {
      const customOnly = newCatalog.filter(m => m.id.startsWith('CUSTOM_'));
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_MOTORS, JSON.stringify(customOnly));
    } catch (e) {
      console.error('Failed to save updated catalog:', e);
    }
  };

  // Perform engineering physics calculation whenever inputs change
  const results = useMemo(() => {
    return calculateMotorSizing({
      ...inputs,
      mechanismType,
      motor
    });
  }, [inputs, mechanismType, motor]);

  return (
    <div className="app-layout">
      {/* Header with mechanism tabs */}
      <Header
        mechanismType={mechanismType}
        setMechanismType={handleMechanismChange}
        onResetDefaults={handleResetDefaults}
        onOpenFormulas={() => setShowFormulas(true)}
        onOpenRawData={() => setShowRawData(true)}
        onExportReport={() => setShowReport(true)}
      />

      {/* Main Dashboard Grid */}
      <main className="dashboard-content">
        {/* Top 3 Input Columns (Exact match with spreadsheet top 3 boxes) */}
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
          <MotorSelect
            motor={motor}
            setMotor={setMotor}
            motorCatalog={motorCatalog}
            onOpenAddMotor={() => setShowAddMotor(true)}
          />
        </div>

        {/* Middle 3 Result Columns (Exact match with spreadsheet middle 3 boxes) */}
        <div className="grid-3col margin-top">
          <CalculationResults results={results} />
          <EvaluationCheck results={results} />
          <RegenerationCheck regen={results.regen} />
        </div>

        {/* Interactive 2D Mechanism Visualizer */}
        <div className="margin-top">
          <MechanismVisualizer
            inputs={{ ...inputs, motorModel: motor.model }}
            results={results}
            mechanismType={mechanismType}
          />
        </div>

        {/* Bottom Motion Profile Graph (Exact match with spreadsheet graph) */}
        <div className="margin-top">
          <MotionProfileGraph
            points={results.profilePoints}
            motor={motor}
          />
        </div>
      </main>

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

      {/* Report Modal */}
      {showReport && (
        <ReportView
          inputs={inputs}
          motor={motor}
          results={results}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
