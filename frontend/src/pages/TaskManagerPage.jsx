import React, { useState } from "react";
import GanttChart from "../components/GanttChart";

const TaskManagerPage = () => {
  const [tasks] = useState([
    {
      id: 1,
      project: "請求管理システム",
      name: "ストアド修正",
      assignee: "佐藤",
      month: "2025-05",
      plannedCount: 10,
      actualCount: 4,
      unit: "本",
      startDate: "2025-05-03",
      endDate: "2025-05-15",
    },
    {
      id: 2,
      project: "請求管理システム",
      name: "画面改修",
      assignee: "山田",
      month: "2025-05",
      plannedCount: 6,
      actualCount: 6,
      unit: "画面",
      startDate: "2025-06-01",
      endDate: "2025-06-20",
    },
    {
      id: 3,
      project: "販売分析システム",
      name: "分析ロジック",
      assignee: "佐脇",
      month: "2025-07",
      plannedCount: 8,
      actualCount: 2,
      unit: "本",
      startDate: "2025-07-10",
      endDate: "2025-08-01",
    },
  ]);

  const projects = [...new Set(tasks.map((t) => t.project))];
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const filteredTasks = tasks.filter((t) => t.project === selectedProject);

  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <aside className="w-52 border-r p-4 text-sm">
        <h2 className="text-lg font-bold mb-2">📁 プロジェクト</h2>
        <ul className="space-y-1">
          {projects.map((project, idx) => (
            <li
              key={idx}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${
                project === selectedProject ? "font-bold text-orange-600" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              {project}
            </li>
          ))}
        </ul>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-6 bg-white flex flex-col gap-12">
        <h1 className="text-xl font-bold">🛠 タスク管理（管理者）</h1>

        {/* 📋 タスク一覧テーブル */}
        <section className="overflow-x-auto border rounded shadow">
          <table className="table-fixed text-xs border-collapse w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border p-1 w-[240px] whitespace-nowrap">
                  タスク名
                </th>
                <th className="border p-1 w-[80px] whitespace-nowrap">担当</th>
                <th className="border p-1 w-[80px] whitespace-nowrap">月</th>
                <th className="border p-1 w-[100px] whitespace-nowrap">予定</th>
                <th className="border p-1 w-[100px] whitespace-nowrap">実績</th>
                <th className="border p-1 w-[100px] whitespace-nowrap">進捗</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const progress =
                  task.plannedCount === 0
                    ? 0
                    : Math.round((task.actualCount / task.plannedCount) * 100);
                return (
                  <tr key={task.id} className="text-center">
                    <td className="border p-1 w-[240px]">{task.name}</td>
                    <td className="border p-1">{task.assignee}</td>
                    <td className="border p-1">{task.month}</td>
                    <td className="border p-1">
                      {task.plannedCount} {task.unit}
                    </td>
                    <td className="border p-1 text-blue-600 font-semibold">
                      {task.actualCount} {task.unit}
                    </td>
                    <td className="border p-1">
                      <div className="w-full bg-gray-200 rounded h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] mt-1">{progress}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* 📆 ガントチャート表示 */}
        <section className="border rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">📅 ガントチャート</h2>
          <div className="overflow-x-auto">
            <GanttChart
              startDate="2025-05-01"
              endDate="2025-10-31"
              tasks={filteredTasks}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default TaskManagerPage;
