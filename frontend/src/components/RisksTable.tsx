import type { RiskItem } from "../types/meeting";
import { ValueBadge } from "./ValueBadge";

interface RisksTableProps {
  risks: RiskItem[];
}

export function RisksTable({ risks }: RisksTableProps) {
  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>风险问题</h3>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>风险</th>
              <th>影响</th>
              <th>建议跟进</th>
              <th>负责人</th>
              <th>严重程度</th>
            </tr>
          </thead>
          <tbody>
            {risks.length ? (
              risks.map((item, index) => (
                <tr key={`${item.risk}-${index}`}>
                  <td>{item.risk || "未知"}</td>
                  <td>{item.impact || "未知"}</td>
                  <td>{item.suggested_followup || "未知"}</td>
                  <td>{item.owner || "未知"}</td>
                  <td>
                    <ValueBadge type="severity" value={item.severity} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-cell" colSpan={5}>
                  未识别到明确风险问题。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
