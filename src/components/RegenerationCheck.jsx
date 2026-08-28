import React from 'react';
import { Zap } from 'lucide-react';

export default function RegenerationCheck({ regen }) {
  const data = regen || {
    regenEnergyPerCycle: -22.67,
    internalShuntRes: 50,
    internalShuntCap: 30,
    extShuntResText: '불필요',
    extShuntCapText: '불필요'
  };

  return (
    <div className="card check-card">
      <div className="card-header border-green">
        <div className="card-title">
          <Zap size={18} className="text-green" />
          <h2>* 회생 저항 검토 (Regenerative Resistor Review)</h2>
        </div>
      </div>

      <div className="card-body">
        <table className="excel-table regen-table">
          <tbody>
            <tr>
              <td className="field-label">회생 에너지 (Regen Energy)</td>
              <td className="field-value readonly-cell font-mono text-center font-bold">
                {data.regenEnergyPerCycle !== undefined ? data.regenEnergyPerCycle.toFixed(2) : '-22.67'}
              </td>
              <td className="field-unit">W</td>
            </tr>

            <tr>
              <td className="field-label">내부 Shunt 저항값</td>
              <td className="field-value readonly-cell font-mono text-center">
                {data.internalShuntRes}
              </td>
              <td className="field-unit">Ohm</td>
            </tr>

            <tr>
              <td className="field-label">내부 Shunt 용량</td>
              <td className="field-value readonly-cell font-mono text-center">
                {data.internalShuntCap}
              </td>
              <td className="field-unit">W</td>
            </tr>

            <tr>
              <td className="field-label">외부 Shunt 저항값</td>
              <td className={`field-value text-center font-bold ${data.isExternalShuntNeeded ? 'text-warn' : 'highlight-cell-green'}`}>
                {data.extShuntResText}
              </td>
              <td className="field-unit">Ohm</td>
            </tr>

            <tr>
              <td className="field-label">외부 Shunt 용량값</td>
              <td className={`field-value text-center font-bold ${data.isExternalShuntNeeded ? 'text-warn' : 'highlight-cell-green'}`}>
                {data.extShuntCapText}
              </td>
              <td className="field-unit">W</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
