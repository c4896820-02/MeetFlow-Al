import type { Decision } from "../types/meeting";
import { ValueBadge } from "./ValueBadge";

interface DecisionsTableProps {
  decisions: Decision[];
}

export function DecisionsTable({ decisions }: DecisionsTableProps) {
  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>关键决策</h3>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>决策</th>
              <th>负责人</th>
              <th>证据时间</th>
              <th>置信度</th>
            </tr>
          </thead>
          <tbody>
            {decisions.length ? (
              decisions.map((item, index) => (
                <tr key={`${item.decision}-${index}`}>
                  <td>{item.decision || "未知"}</td>
                  <td>{item.owner || "未知"}</td>
                  <td>{item.evidence_time || "未知"}</td>
                  <td>
                    <ValueBadge type="confidence" value={item.confidence} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-cell" colSpan={4}>
                  未识别到明确关键决策。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
