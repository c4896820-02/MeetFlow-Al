import type { RiskItem } from "../types/meeting";

interface RisksTableProps {
  risks: RiskItem[];
}

export function RisksTable({ risks }: RisksTableProps) {
  return (
    <section className="panel">
      <h2>风险与待确认问题</h2>
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
                  <td>{item.risk}</td>
                  <td>{item.impact}</td>
                  <td>{item.suggested_followup}</td>
                  <td>{item.owner}</td>
                  <td>{item.severity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>暂无风险。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
