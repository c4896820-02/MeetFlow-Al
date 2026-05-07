import type { ActionItem } from "../types/meeting";

interface ActionItemsTableProps {
  actionItems: ActionItem[];
}

export function ActionItemsTable({ actionItems }: ActionItemsTableProps) {
  return (
    <section className="panel">
      <h2>TODO 清单</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务</th>
              <th>负责人</th>
              <th>截止时间</th>
              <th>优先级</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {actionItems.length ? (
              actionItems.map((item, index) => (
                <tr key={`${item.task}-${index}`}>
                  <td>{item.task}</td>
                  <td>{item.owner}</td>
                  <td>{item.deadline}</td>
                  <td>{item.priority}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>暂无 TODO。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
