import type { Decision } from "../types/meeting";

interface DecisionsTableProps {
  decisions: Decision[];
}

export function DecisionsTable({ decisions }: DecisionsTableProps) {
  return (
    <section className="panel">
      <h2>关键决策</h2>
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
                  <td>{item.decision}</td>
                  <td>{item.owner}</td>
                  <td>{item.evidence_time}</td>
                  <td>{item.confidence}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>暂无关键决策。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
