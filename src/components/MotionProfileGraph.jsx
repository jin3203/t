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
import { Activity } from 'lucide-react';
import { safeNum, safeFixed } from '../utils/motorCalculations';

export default function MotionProfileGraph({ points }) {
  if (!points || points.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title font-bold">시간: {safeNum(data.timeMs).toFixed(0)} ms ({data.phase || ''})</p>
          <p className="text-blue font-mono" style={{ color: '#2563eb' }}>
            부하 속도 (Velocity): <strong>{safeFixed(data.velocity, 3)} m/s</strong>
          </p>
          <p className="text-purple font-mono" style={{ color: '#9333ea' }}>
            모터 회전수 (RPM): <strong>{Math.round(safeNum(data.rpm))} RPM</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card graph-card" style={{ height: '100%' }}>
      <div className="card-header border-blue">
        <div className="card-title">
          <Activity size={18} className="text-blue" />
          <h2>모션 프로파일 그래프 (Velocity & Speed Profile)</h2>
        </div>
        <div className="graph-legend-info">
          <span className="legend-item blue-dot">■ Velocity [m/s]</span>
          <span className="legend-item purple-dot" style={{ color: '#9333ea' }}>■ Motor Speed [RPM]</span>
        </div>
      </div>

      <div className="card-body graph-container" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={points} margin={{ top: 20, right: 35, left: 10, bottom: 25 }}>
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
              stroke="#2563eb"
              domain={[0, 'auto']}
              label={{ value: 'Velocity [m/sec]', angle: -90, position: 'insideLeft', offset: 10, fill: '#2563eb', fontSize: 12 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9333ea"
              domain={[0, 'auto']}
              label={{ value: 'Motor Speed [RPM]', angle: 90, position: 'insideRight', offset: 10, fill: '#9333ea', fontSize: 12 }}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine yAxisId="left" y={0} stroke="#94a3b8" strokeDasharray="2 2" />

            {/* Velocity Line (Blue) */}
            <Line
              yAxisId="left"
              type="linear"
              dataKey="velocity"
              name="Velocity [m/s]"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563eb' }}
              activeDot={{ r: 7 }}
            />

            {/* Motor RPM Line (Purple) */}
            <Line
              yAxisId="right"
              type="linear"
              dataKey="rpm"
              name="Speed [RPM]"
              stroke="#9333ea"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#9333ea' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
