/**
 * Physics Engine for Motor Selection & Analysis
 */

export function calculateMotorSizing({
  mechanismType = 'ballscrew_h',
  // Mechanism inputs
  lead = 0.02, // m
  length = 1.4, // m
  diameter = 0.02, // m
  mass = 8.0, // kg
  friction = 0.2,
  thrustForce = 0.0, // N
  efficiency = 0.8,
  safetyFactor = 1.2,
  addInertia = 0.0, // kg·m^2
  gearRatio = 1.0, // reduction ratio (N_motor / N_load)
  density = 7870, // kg/m^3 (Steel)
  // Additional params for belt/rack/rotary
  pulleyDiameter = 0.05, // m
  tableInertia = 0.001, // kg·m^2

  // Motion Profile inputs
  distance = 1.1, // m
  maxVelocity = 0.5, // m/sec
  moveTime = 2.0, // sec
  accelTime = 0.5, // sec
  decelTime = 0.5, // sec
  dwellTime = 1.0, // sec

  // Motor inputs
  motor = {}
}) {
  const g = 9.81; // m/s^2

  // 1. Calculated Mechanical Inertia (J_load)
  let screwInertia = 0.0;
  let massInertia = 0.0;
  let loadInertia = 0.0;

  if (mechanismType === 'ballscrew_h' || mechanismType === 'ballscrew_v') {
    // J_screw = (pi / 32) * density * length * diameter^4
    screwInertia = (Math.PI / 32) * density * length * Math.pow(diameter, 4);
    // J_mass = Mass * (Lead / (2 * pi))^2
    massInertia = mass * Math.pow(lead / (2 * Math.PI), 2);
    // Total J_load converted to motor shaft
    loadInertia = (screwInertia + massInertia) / Math.pow(gearRatio, 2) + addInertia;
  } else if (mechanismType === 'belt_h') {
    // Belt pulley inertia (assuming 2 aluminum pulleys)
    const pulleyRadius = pulleyDiameter / 2;
    const pulleyVolume = Math.PI * Math.pow(pulleyRadius, 2) * 0.02; // assume 20mm width
    const pulleyMass = 2700 * pulleyVolume;
    screwInertia = 2 * (0.5 * pulleyMass * Math.pow(pulleyRadius, 2));
    massInertia = mass * Math.pow(pulleyRadius, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(gearRatio, 2) + addInertia;
  } else if (mechanismType === 'rack_pinion') {
    const pinionRadius = pulleyDiameter / 2;
    screwInertia = 0.5 * 1.5 * Math.pow(pinionRadius, 2); // pinion approx
    massInertia = mass * Math.pow(pinionRadius, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(gearRatio, 2) + addInertia;
  } else {
    // Rotary Table
    screwInertia = tableInertia;
    massInertia = mass * Math.pow(pulleyDiameter / 2, 2);
    loadInertia = (screwInertia + massInertia) / Math.pow(gearRatio, 2) + addInertia;
  }

  // 2. Motion Profile Calculations
  const t_a = Math.max(0.001, accelTime);
  const t_d = Math.max(0.001, decelTime);
  const t_c = Math.max(0, moveTime - t_a - t_d);
  const cycleTime = moveTime + dwellTime;

  // Linear to Rotary Speed
  let maxMotorRPM = 0;
  if (mechanismType.startsWith('ballscrew')) {
    // RPM = (v_max / Lead) * 60 * GearRatio
    maxMotorRPM = (maxVelocity / lead) * 60 * gearRatio;
  } else if (mechanismType === 'belt_h' || mechanismType === 'rack_pinion') {
    // RPM = (v_max / (pi * D_pulley)) * 60 * GearRatio
    maxMotorRPM = (maxVelocity / (Math.PI * pulleyDiameter)) * 60 * gearRatio;
  } else {
    // Rotary
    maxMotorRPM = (maxVelocity * 60 / (2 * Math.PI)) * gearRatio;
  }

  // Angular velocity omega (rad/sec)
  const omega = (2 * Math.PI * maxMotorRPM) / 60;
  // Angular acceleration alpha (rad/sec^2)
  const alpha_a = omega / t_a;
  const alpha_d = omega / t_d;

  // 3. Force & Torque Requirements
  // Friction / Gravity Force
  let thrustLoadForce = 0;
  if (mechanismType === 'ballscrew_v') {
    // Vertical: Mass * g + friction force
    thrustLoadForce = mass * g + friction * mass * g + thrustForce;
  } else {
    // Horizontal: friction * mass * g + external thrust force
    thrustLoadForce = friction * mass * g + thrustForce;
  }

  // Constant velocity running load torque T_L (at motor shaft)
  let constantLoadTorque = 0;
  if (mechanismType.startsWith('ballscrew')) {
    constantLoadTorque = (thrustLoadForce * lead) / (2 * Math.PI * efficiency * gearRatio);
  } else if (mechanismType === 'belt_h' || mechanismType === 'rack_pinion') {
    constantLoadTorque = (thrustLoadForce * (pulleyDiameter / 2)) / (efficiency * gearRatio);
  } else {
    constantLoadTorque = (thrustLoadForce * 0.1) / (efficiency * gearRatio);
  }

  // Total inertia J_total = J_motor + J_load
  const motorInertia = motor.rotorInertia || 0.35e-4;
  const totalInertia = motorInertia + loadInertia;

  // Inertia ratio
  const inertiaRatio = loadInertia / (motorInertia || 1e-6);

  // Inertial Acceleration/Deceleration Torque
  // Note: Standard formula T_accel = J_total * alpha * safetyFactor + T_L
  const accelInertiaTorque = totalInertia * alpha_a * safetyFactor;
  const decelInertiaTorque = totalInertia * alpha_d * safetyFactor;

  // Total Required Torques
  const reqAccelTorque = accelInertiaTorque + constantLoadTorque;
  const reqDecelTorque = -decelInertiaTorque + constantLoadTorque;
  const reqRunTorque = constantLoadTorque;

  // RMS Torque (Root Mean Square)
  // T_rms = sqrt( (T_a^2 * t_a + T_L^2 * t_c + T_d^2 * t_d) / t_cycle )
  const rmsSum = (Math.pow(reqAccelTorque, 2) * t_a) + (Math.pow(reqRunTorque, 2) * t_c) + (Math.pow(reqDecelTorque, 2) * t_d);
  const rmsTorque = Math.sqrt(rmsSum / Math.max(0.1, cycleTime));

  // 4. Pass / Fail Verification Checks
  const motorRatedTorque = motor.ratedTorque || 1.27;
  const motorMaxTorque = motor.maxTorque || 4.46;
  const motorMaxRPM = motor.maxSpeed || 6000;
  const motorRatedRPM = motor.ratedSpeed || 3000;

  const checkAccelTorquePct = (reqAccelTorque / motorMaxTorque) * 100;
  const checkDecelTorquePct = (reqDecelTorque / motorRatedTorque) * 100;
  const checkRmsTorquePct = (rmsTorque / motorRatedTorque) * 100;
  const checkMaxSpeedPct = (maxMotorRPM / motorMaxRPM) * 100;

  const isAccelOk = reqAccelTorque <= motorMaxTorque;
  const isDecelOk = Math.abs(reqDecelTorque) <= motorMaxTorque;
  const isRmsOk = rmsTorque <= motorRatedTorque;
  const isSpeedOk = maxMotorRPM <= motorMaxTorque ? true : maxMotorRPM <= motorMaxRPM;
  const isInertiaOk = inertiaRatio <= (motor.recommendedMaxInertiaRatio || 30);

  const overallOk = isAccelOk && isDecelOk && isRmsOk && isSpeedOk && isInertiaOk;

  // 5. Regenerative Braking Review
  // Kinetic energy stored = 0.5 * J_total * omega^2
  const kineticEnergy = 0.5 * totalInertia * Math.pow(omega, 2);
  // Mechanical loss energy during deceleration = T_L * (omega / 2) * t_d
  const lossEnergy = constantLoadTorque * (omega / 2) * t_d;
  const regenEnergyPerCycle = Math.max(0, kineticEnergy - lossEnergy);
  const averageRegenPower = regenEnergyPerCycle / Math.max(0.1, cycleTime);

  const internalShuntRes = motor.internalShuntRes || 50;
  const internalShuntCap = motor.internalShuntCap || 30;
  const isExternalShuntNeeded = averageRegenPower > internalShuntCap;

  // 6. Time-Series Graph Profile Data Generator
  const profilePoints = generateProfilePoints({
    accelTime: t_a,
    constantTime: t_c,
    decelTime: t_d,
    dwellTime,
    maxVelocity,
    maxRPM: maxMotorRPM,
    accelTorque: reqAccelTorque,
    runTorque: reqRunTorque,
    decelTorque: reqDecelTorque,
    ratedTorque: motorRatedTorque,
    maxTorque: motorMaxTorque
  });

  return {
    // Inertia outputs
    screwInertia,
    massInertia,
    loadInertia,
    motorInertia,
    totalInertia,
    inertiaRatio,
    // Motion outputs
    constantTime: t_c,
    cycleTime,
    maxMotorRPM,
    omega,
    // Torque outputs
    reqAccelTorque,
    reqDecelTorque,
    reqRunTorque,
    rmsTorque,
    // Verification outputs
    checks: {
      accelTorque: { ok: isAccelOk, pct: checkAccelTorquePct, val: reqAccelTorque, max: motorMaxTorque },
      decelTorque: { ok: isDecelOk, pct: checkDecelTorquePct, val: reqDecelTorque, max: motorMaxTorque },
      rmsTorque: { ok: isRmsOk, pct: checkRmsTorquePct, val: rmsTorque, max: motorRatedTorque },
      inertiaRatio: { ok: isInertiaOk, val: inertiaRatio, recommended: motor.recommendedMaxInertiaRatio || 30 },
      maxSpeed: { ok: isSpeedOk, pct: checkMaxSpeedPct, val: maxMotorRPM, max: motorMaxRPM }
    },
    overallOk,
    // Regeneration outputs
    regen: {
      kineticEnergy,
      regenEnergyPerCycle: -averageRegenPower, // matches minus sign in image (-22.67 W)
      internalShuntRes,
      internalShuntCap,
      isExternalShuntNeeded,
      extShuntResText: isExternalShuntNeeded ? '필요 (문의)' : '불필요',
      extShuntCapText: isExternalShuntNeeded ? `${(averageRegenPower * 1.5).toFixed(1)} W` : '불필요'
    },
    // Chart points
    profilePoints
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
  const t0 = 0;
  const t1 = accelTime * 1000; // ms
  const t2 = (accelTime + constantTime) * 1000; // ms
  const t3 = (accelTime + constantTime + decelTime) * 1000; // ms
  const t4 = (accelTime + constantTime + decelTime + dwellTime) * 1000; // ms

  // Calculate torque % relative to rated torque for dual axis
  const accelTorquePct = (accelTorque / ratedTorque) * 100;
  const runTorquePct = (runTorque / ratedTorque) * 100;
  const decelTorquePct = (decelTorque / ratedTorque) * 100;

  return [
    { timeMs: 0, velocity: 0, rpm: 0, torqueNm: accelTorque, torquePct: accelTorquePct, phase: 'Start' },
    { timeMs: t1 * 0.99, velocity: maxVelocity, rpm: maxRPM, torqueNm: accelTorque, torquePct: accelTorquePct, phase: 'Accel End' },
    { timeMs: t1, velocity: maxVelocity, rpm: maxRPM, torqueNm: runTorque, torquePct: runTorquePct, phase: 'Const Start' },
    { timeMs: t2 * 0.99, velocity: maxVelocity, rpm: maxRPM, torqueNm: runTorque, torquePct: runTorquePct, phase: 'Const End' },
    { timeMs: t2, velocity: maxVelocity, rpm: maxRPM, torqueNm: decelTorque, torquePct: decelTorquePct, phase: 'Decel Start' },
    { timeMs: t3 * 0.99, velocity: 0, rpm: 0, torqueNm: decelTorque, torquePct: decelTorquePct, phase: 'Decel End' },
    { timeMs: t3, velocity: 0, rpm: 0, torqueNm: 0, torquePct: 0, phase: 'Rest Start' },
    { timeMs: t4, velocity: 0, rpm: 0, torqueNm: 0, torquePct: 0, phase: 'Cycle End' }
  ];
}
