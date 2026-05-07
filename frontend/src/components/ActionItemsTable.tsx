import type { ActionItem } from "../types/meeting";
import { ValueBadge } from "./ValueBadge";

interface ActionItemsTableProps {
  actionItems: ActionItem[];
}

export function ActionItemsTable({ actionItems }: ActionItemsTableProps) {
  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>TODO 清单</h3>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务</th>
              <th>负责人</th>
              <th>截止时间</th>
              <th>优先级</th>
              <th>状态</th>
              <th>证据时间</th>
            </tr>
          </thead>
          <tbody>
            {actionItems.length ? (
              actionItems.map((item, index) => (
                <tr key={`${item.task}-${index}`}>
                  <td>{item.task || "未知"}</td>
                  <td>{item.owner || "未知"}</td>
                  <td>{item.deadline || "未知"}</td>
                  <td>
                    <ValueBadge type="priority" value={item.priority} />
                  </td>
                  <td>
                    <ValueBadge type="status" value={item.status} />
                  </td>
                  <td>{item.evidence_time || "未知"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-cell" colSpan={6}>
                  未识别到明确 TODO。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
