import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { safeNum, safeFixed } from '../utils/motorCalculations';

export default function TorqueProfileGraph({ points, results, motor }) {
  if (!points || points.length === 0) return null;

  const ratedTorque = safeNum(results?.motorLimits?.ratedTorque || motor?.ratedTorque, 1.27);
  const maxTorque = safeNum(results?.motorLimits?.maxTorque || motor?.maxTorque, 4.46);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title font-bold">시간: {safeNum(data.timeMs).toFixed(0)} ms ({data.phase || ''})</p>
          <p className="text-red font-mono" style={{ color: '#dc2626' }}>
            계산 토크 (Torque): <strong>{safeFixed(data.torqueNm, 2)} N·m</strong>
          </p>
          <p className="font-mono" style={{ color: '#059669' }}>
            정격 토크 대비 부하율: <strong>{safeFixed(data.torquePct, 1)}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card graph-card margin-top">
      <div className="card-header border-blue">
        <div className="card-title">
          <TrendingUp size={18} className="text-red" style={{ color: '#dc2626' }} />
          <h2>입력 속도프로파일에 따른 계산된 토크 프로파일 그래프 (Calculated Torque Profile)</h2>
        </div>
        <div className="graph-legend-info">
          <span className="legend-item red-dot">◆ 소요 토크 [N·m]</span>
          <span className="legend-item" style={{ color: '#166534', fontWeight: 700 }}>━ 정격 토크 ({ratedTorque} N·m)</span>
          <span className="legend-item" style={{ color: '#b91c1c', fontWeight: 700 }}>━ 순간최대 토크 ({maxTorque} N·m)</span>
        </div>
      </div>

      <div className="card-body graph-container" style={{ minHeight: '320px' }}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={points} margin={{ top: 25, right: 35, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e5ed" />
            <XAxis
              dataKey="timeMs"
              unit="ms"
              label={{ value: 'Time [msec]', position: 'insideBottom', offset: -15, fill: '#475569', fontSize: 12 }}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#dc2626"
              domain={['auto', 'auto']}
              label={{ value: 'Calculated Torque [N·m]', angle: -90, position: 'insideLeft', offset: 10, fill: '#dc2626', fontSize: 12 }}
              tickFormatter={(v) => safeFixed(v, 2)}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Zero Torque Baseline */}
            <ReferenceLine yAxisId="left" y={0} stroke="#94a3b8" strokeDasharray="2 2" />

            {/* Motor Continuous Rated Torque Line */}
            <ReferenceLine
              yAxisId="left"
              y={ratedTorque}
              stroke="#166534"
              strokeDasharray="4 2"
              strokeWidth={2}
              label={{ value: `모터 정격 토크 (${ratedTorque} N·m)`, position: 'top', fill: '#166534', fontSize: 11, fontWeight: 'bold' }}
            />

            {/* Motor Peak Max Torque Line */}
            <ReferenceLine
              yAxisId="left"
              y={maxTorque}
              stroke="#b91c1c"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{ value: `모터 최대 토크 (${maxTorque} N·m)`, position: 'top', fill: '#b91c1c', fontSize: 11, fontWeight: 'bold' }}
            />

            {/* Calculated Torque Line */}
            <Line
              yAxisId="left"
              type="linear"
              dataKey="torqueNm"
              name="Torque [N·m]"
              stroke="#dc2626"
              strokeWidth={3}
              dot={{ r: 5, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
