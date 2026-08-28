import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export default function MotionProfileGraph({ points, motor }) {
  if (!points || points.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title font-bold">시간: {data.timeMs.toFixed(0)} ms ({data.phase || ''})</p>
          <p className="text-blue font-mono">
            속도 (Velocity): <strong>{data.velocity.toFixed(3)} m/s</strong> ({Math.round(data.rpm)} RPM)
          </p>
          <p className="text-red font-mono">
            토크 (Torque): <strong>{data.torqueNm.toFixed(2)} N·m</strong> ({data.torquePct.toFixed(2)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card graph-card">
      <div className="card-header border-blue">
        <div className="card-title">
          <ChartIcon size={18} className="text-blue" />
          <h2>구동 및 토크 프로파일 그래프 (Motion Velocity & Torque Profile)</h2>
        </div>
        <div className="graph-legend-info">
          <span className="legend-item blue-dot">■ Velocity [m/sec] (실선)</span>
          <span className="legend-item red-dot">◆ Torque [N·m] (점선)</span>
        </div>
      </div>

      <div className="card-body graph-container">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={points} margin={{ top: 20, right: 40, left: 10, bottom: 25 }}>
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
              stroke="#1e40af"
              domain={[0, 'dataMax + 0.1']}
              label={{ value: 'Velocity [m/sec]', angle: -90, position: 'insideLeft', offset: 10, fill: '#1e40af', fontSize: 12 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#dc2626"
              domain={['auto', 'auto']}
              label={{ value: 'Torque [N·m]', angle: 90, position: 'insideRight', offset: 10, fill: '#dc2626', fontSize: 12 }}
              tickFormatter={(v) => typeof v === 'number' ? v.toFixed(2) : v}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine yAxisId="right" y={0} stroke="#94a3b8" strokeDasharray="2 2" />

            {/* Velocity Line: Solid Navy Blue */}
            <Line
              yAxisId="left"
              type="linear"
              dataKey="velocity"
              name="Velocity [m/s]"
              stroke="#1d4ed8"
              strokeWidth={3}
              dot={{ r: 3, fill: '#1d4ed8' }}
              activeDot={{ r: 6 }}
            />

            {/* Torque Line: Dashed Red */}
            <Line
              yAxisId="right"
              type="linear"
              dataKey="torqueNm"
              name="Torque [N·m]"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
