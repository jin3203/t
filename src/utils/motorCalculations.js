/**
 * Physics Engine for Motor Selection & Analysis
 * Robust against NaN, 0-division, and temporary empty string inputs.
 */

// Helper function to safely parse numbers with fallback
export function safeNum(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

// Helper function to ensure positive non-zero numbers for denominators
export function safePositive(val, fallback = 1, min = 1e-6) {
  const num = safeNum(val, fallback);
  return Math.max(min, Math.abs(num));
}

// Helper function to format numbers safely without throwing on NaN
export function safeFixed(val, digits = 2, fallback = '0.00') {
  const num = safeNum(val, null);
  if (num === null) return fallback;
  return num.toFixed(digits);
}

export function calculateMotorSizing({
  mechanismType = 'ballscrew_h',
  // Mechanism inputs
  lead = 0.02,
  length = 1.4,
  diameter = 0.02,
  mass = 8.0,
  friction = 0.2,
  thrustForce = 0.0,
  efficiency = 0.8,
  safetyFactor = 1.2,
  addInertia = 0.0,
  gearRatio = 1.0,
  density = 7870,
  pulleyDiameter = 0.05,
  tableInertia = 0.001,

  // Motion Profile inputs
  distance = 1.1,
  maxVelocity = 0.5,
  moveTime = 2.0,
  accelTime = 0.5,
  decelTime = 0.5,
  dwellTime = 1.0,

  // Motor inputs
  motor = {}
}) {
  const g = 9.81;

  // Sanitize all inputs to prevent NaN or division by zero
  const safeLead = safePositive(lead, 0.02, 0.0001);
  const safeLength = safePositive(length, 1.4, 0.001);
  const safeDiameter = safePositive(diameter, 0.02, 0.001);
  const safeMass = safeNum(mass, 0);
  const safeFriction = safeNum(friction, 0);
  const safeThrustForce = safeNum(thrustForce, 0);
  const safeEfficiency = safePositive(efficiency, 0.8, 0.01);
  const safeSafetyFactor = safePositive(safetyFactor, 1.2, 1.0);
  const safeAddInertia = safeNum(addInertia, 0);
  const safeGearRatio = safePositive(gearRatio, 1.0, 0.001);
  const safeDensity = safePositive(density, 7870, 1);
  const safePulleyDiameter = safePositive(pulleyDiameter, 0.05, 0.001);
  const safeTableInertia = safeNum(tableInertia, 0.001);

  const safeDistance = safeNum(distance, 1.0);
  const safeMaxVelocity = safeNum(maxVelocity, 0.5);
  const safeMoveTime = safePositive(moveTime, 2.0, 0.01);
  const safeAccelTime = safePositive(accelTime, 0.5, 0.001);
  const safeDecelTime = safePositive(decelTime, 0.5, 0.001);
  const safeDwellTime = safeNum(dwellTime, 0);

  // 1. Calculated Mechanical Inertia (J_load)
  let screwInertia = 0.0;
  let massInertia = 0.0;
  let loadInertia = 0.0;

  if (mechanismType === 'ballscrew_h' || mechanismType === 'ballscrew_v') {
    // J_screw = (pi / 32) * density * length * diameter^4
    screwInertia = (Math.PI / 32) * safeDensity * safeLength * Math.pow(safeDiameter, 4);
    // J_mass = Mass * (Lead / (2 * pi))^2
    massInertia = safeMass * Math.pow(safeLead / (2 * Math.PI), 2);
    // Total J_load converted to motor shaft
    loadInertia = (screwInertia + massInertia) / Math.pow(safeGearRatio, 2) + safeAddInertia;
  } else if (mechanismType === 'belt_h') {
    const pulleyRadius = safePulleyDiameter / 2;
    const pulleyVolume = Math.PI * Math.pow(pulleyRadius, 2) * 0.02;
    const pulleyMass = 2700 * pulleyVolume;
    screwInertia = 2 * (0.5 * pulleyMass * Math.pow(pulleyRadius, 2));
    massInertia = safeMass * Math.pow(pulleyRadius, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(safeGearRatio, 2) + safeAddInertia;
  } else if (mechanismType === 'rack_pinion') {
    const pinionRadius = safePulleyDiameter / 2;
    screwInertia = 0.5 * 1.5 * Math.pow(pinionRadius, 2);
    massInertia = safeMass * Math.pow(pinionRadius, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(safeGearRatio, 2) + safeAddInertia;
  } else {
    // Rotary Table
    screwInertia = safeTableInertia;
    massInertia = safeMass * Math.pow(safePulleyDiameter / 2, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(safeGearRatio, 2) + safeAddInertia;
  }

  // 2. Motion Profile Calculations
  const t_a = Math.max(0.001, safeAccelTime);
  const t_d = Math.max(0.001, safeDecelTime);
  const t_c = Math.max(0, safeMoveTime - t_a - t_d);
  const cycleTime = Math.max(0.01, safeMoveTime + safeDwellTime);

  // Linear to Rotary Speed
  let maxMotorRPM = 0;
  if (mechanismType.startsWith('ballscrew')) {
    maxMotorRPM = (safeMaxVelocity / safeLead) * 60 * safeGearRatio;
  } else if (mechanismType === 'belt_h' || mechanismType === 'rack_pinion') {
    maxMotorRPM = (safeMaxVelocity / (Math.PI * safePulleyDiameter)) * 60 * safeGearRatio;
  } else {
    maxMotorRPM = (safeMaxVelocity * 60 / (2 * Math.PI)) * safeGearRatio;
  }

  // Angular velocity omega (rad/sec)
  const omega = (2 * Math.PI * maxMotorRPM) / 60;
  // Angular acceleration alpha (rad/sec^2)
  const alpha_a = omega / t_a;
  const alpha_d = omega / t_d;

  // 3. Force & Torque Requirements
  let thrustLoadForce = 0;
  if (mechanismType === 'ballscrew_v') {
    thrustLoadForce = safeMass * g + safeFriction * safeMass * g + safeThrustForce;
  } else {
    thrustLoadForce = safeFriction * safeMass * g + safeThrustForce;
  }

  let constantLoadTorque = 0;
  if (mechanismType.startsWith('ballscrew')) {
    constantLoadTorque = (thrustLoadForce * safeLead) / (2 * Math.PI * safeEfficiency * safeGearRatio);
  } else if (mechanismType === 'belt_h' || mechanismType === 'rack_pinion') {
    constantLoadTorque = (thrustLoadForce * (safePulleyDiameter / 2)) / (safeEfficiency * safeGearRatio);
  } else {
    constantLoadTorque = (thrustLoadForce * 0.1) / (safeEfficiency * safeGearRatio);
  }

  const motorInertia = safePositive(motor.rotorInertia, 0.35e-4, 1e-7);
  const totalInertia = motorInertia + loadInertia;
  const inertiaRatio = loadInertia / motorInertia;

  const accelInertiaTorque = totalInertia * alpha_a * safeSafetyFactor;
  const decelInertiaTorque = totalInertia * alpha_d * safeSafetyFactor;

  const reqAccelTorque = accelInertiaTorque + constantLoadTorque;
  const reqDecelTorque = -decelInertiaTorque + constantLoadTorque;
  const reqRunTorque = constantLoadTorque;

  const rmsSum = (Math.pow(reqAccelTorque, 2) * t_a) + (Math.pow(reqRunTorque, 2) * t_c) + (Math.pow(reqDecelTorque, 2) * t_d);
  const rmsTorque = Math.sqrt(rmsSum / cycleTime);

  // 4. Pass / Fail Verification Checks
  const motorRatedTorque = safePositive(motor.ratedTorque, 1.27, 0.01);
  const motorMaxTorque = safePositive(motor.maxTorque, 4.46, 0.01);
  const motorMaxRPM = safePositive(motor.maxSpeed, 6000, 100);

  const checkAccelTorquePct = (reqAccelTorque / motorMaxTorque) * 100;
  const checkDecelTorquePct = (Math.abs(reqDecelTorque) / motorRatedTorque) * 100;
  const checkRmsTorquePct = (rmsTorque / motorRatedTorque) * 100;
  const checkMaxSpeedPct = (maxMotorRPM / motorMaxRPM) * 100;

  const isAccelOk = reqAccelTorque <= motorMaxTorque;
  const isDecelOk = Math.abs(reqDecelTorque) <= motorMaxTorque;
  const isRmsOk = rmsTorque <= motorRatedTorque;
  const isSpeedOk = maxMotorRPM <= motorMaxRPM;
  const isInertiaOk = inertiaRatio <= (motor.recommendedMaxInertiaRatio || 30);

  const overallOk = isAccelOk && isDecelOk && isRmsOk && isSpeedOk && isInertiaOk;

  // 5. Regenerative Braking Review
  const kineticEnergy = 0.5 * totalInertia * Math.pow(omega, 2);
  const lossEnergy = constantLoadTorque * (omega / 2) * t_d;
  const regenEnergyPerCycle = Math.max(0, kineticEnergy - lossEnergy);
  const averageRegenPower = regenEnergyPerCycle / cycleTime;

  const internalShuntRes = motor.internalShuntRes || 50;
  const internalShuntCap = motor.internalShuntCap || 30;
  const isExternalShuntNeeded = averageRegenPower > internalShuntCap;

  // 6. Profile Points Generation
  const profilePoints = generateProfilePoints({
    accelTime: t_a,
    constantTime: t_c,
    decelTime: t_d,
    dwellTime: safeDwellTime,
    maxVelocity: safeMaxVelocity,
    maxRPM: maxMotorRPM,
    accelTorque: reqAccelTorque,
    runTorque: reqRunTorque,
    decelTorque: reqDecelTorque,
    ratedTorque: motorRatedTorque,
    maxTorque: motorMaxTorque
  });

  return {
    screwInertia,
    massInertia,
    loadInertia,
    motorInertia,
    totalInertia,
    inertiaRatio,
    constantTime: t_c,
    cycleTime,
    maxMotorRPM,
    omega,
    reqAccelTorque,
    reqDecelTorque,
    reqRunTorque,
    rmsTorque,
    checks: {
      accelTorque: { ok: isAccelOk, pct: checkAccelTorquePct, val: reqAccelTorque, max: motorMaxTorque },
      decelTorque: { ok: isDecelOk, pct: checkDecelTorquePct, val: reqDecelTorque, max: motorMaxTorque },
      rmsTorque: { ok: isRmsOk, pct: checkRmsTorquePct, val: rmsTorque, max: motorRatedTorque },
      inertiaRatio: { ok: isInertiaOk, val: inertiaRatio, recommended: motor.recommendedMaxInertiaRatio || 30 },
      maxSpeed: { ok: isSpeedOk, pct: checkMaxSpeedPct, val: maxMotorRPM, max: motorMaxRPM }
    },
    overallOk,
    regen: {
      kineticEnergy,
      regenEnergyPerCycle: -averageRegenPower,
      internalShuntRes,
      internalShuntCap,
      isExternalShuntNeeded,
      extShuntResText: isExternalShuntNeeded ? '필요 (문의)' : '불필요',
      extShuntCapText: isExternalShuntNeeded ? `${(averageRegenPower * 1.5).toFixed(1)} W` : '불필요'
    },
    profilePoints,
    motorLimits: {
      ratedTorque: motorRatedTorque,
      maxTorque: motorMaxTorque,
      ratedSpeed: motor.ratedSpeed || 3000,
      maxSpeed: motorMaxRPM
    }
  };
}

function generateProfilePoints({
  accelTime,
  constantTime,
  decelTime,
  dwellTime,
  maxVelocity,
  maxRPM,
  accelTorque,
  runTorque,
  decelTorque,
  ratedTorque,
  maxTorque
}) {
  const t1 = accelTime * 1000;
  const t2 = (accelTime + constantTime) * 1000;
  const t3 = (accelTime + constantTime + decelTime) * 1000;
  const t4 = (accelTime + constantTime + decelTime + dwellTime) * 1000;

  const accelTorquePct = (accelTorque / safePositive(ratedTorque, 1.27)) * 100;
  const runTorquePct = (runTorque / safePositive(ratedTorque, 1.27)) * 100;
  const decelTorquePct = (decelTorque / safePositive(ratedTorque, 1.27)) * 100;

  return [
    { timeMs: 0, velocity: 0, rpm: 0, torqueNm: accelTorque, torquePct: accelTorquePct, phase: '가속 시작 (Start)' },
    { timeMs: Math.max(1, t1 * 0.99), velocity: maxVelocity, rpm: maxRPM, torqueNm: accelTorque, torquePct: accelTorquePct, phase: '가속 완료 (Accel End)' },
    { timeMs: t1, velocity: maxVelocity, rpm: maxRPM, torqueNm: runTorque, torquePct: runTorquePct, phase: '등속 구간 (Const Speed)' },
    { timeMs: Math.max(t1 + 1, t2 * 0.99), velocity: maxVelocity, rpm: maxRPM, torqueNm: runTorque, torquePct: runTorquePct, phase: '등속 완료 (Const End)' },
    { timeMs: t2, velocity: maxVelocity, rpm: maxRPM, torqueNm: decelTorque, torquePct: decelTorquePct, phase: '감속 구간 (Decel Start)' },
    { timeMs: Math.max(t2 + 1, t3 * 0.99), velocity: 0, rpm: 0, torqueNm: decelTorque, torquePct: decelTorquePct, phase: '감속 완료 (Decel End)' },
    { timeMs: t3, velocity: 0, rpm: 0, torqueNm: 0, torquePct: 0, phase: '휴지 구간 (Dwell Start)' },
    { timeMs: t4, velocity: 0, rpm: 0, torqueNm: 0, torquePct: 0, phase: '주기 완료 (Cycle End)' }
  ];
}
