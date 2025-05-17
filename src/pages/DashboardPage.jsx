import React, { useState } from "react";

const DashboardPage = () => {
  const [selectedProject, setSelectedProject] = useState("プロジェクト1");
  const [selectedMonth, setSelectedMonth] = useState("2025-05");

  const allTasks = [
    {
      id: 1,
      name: "UI設計",
      assignee: "佐藤",
      progress: 80,
      project: "プロジェクト1",
      month: "2025-05",
    },
    {
      id: 2,
      name: "API開発",
      assignee: "山田",
      progress: 50,
      project: "プロジェクト1",
      month: "2025-05",
    },
    {
      id: 3,
      name: "テスト計画",
      assignee: "佐脇",
      progress: 30,
      project: "プロジェクト2",
      month: "2025-04",
    },
    {
      id: 4,
      name: "マニュアル作成",
      assignee: "山田",
      progress: 10,
      project: "プロジェクト1",
      month: "2025-04",
    },
    {
      id: 5,
      name: "実装レビュー",
      assignee: "佐藤",
      progress: 60,
      project: "プロジェクト3",
      month: "2025-05",
    },
  ];

  const filteredTasks = allTasks.filter(
    (task) => task.project === selectedProject && task.month === selectedMonth
  );

  // ✅ サマリー計算
  const totalTasks = filteredTasks.length;
  const averageProgress =
    totalTasks === 0
      ? 0
      : Math.round(
          filteredTasks.reduce((sum, task) => sum + task.progress, 0) /
            totalTasks
        );
  const incompleteCount = filteredTasks.filter(
    (task) => task.progress < 100
  ).length;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 text-xl font-bold">
        プロジェクト進捗ダッシュボード
      </header>

      <div className="flex flex-1">
        {/* LEFT */}
        <aside className="w-[240px] bg-gray-100 p-4 space-y-4">
          <h2 className="font-semibold text-lg">📁 Project Filter</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              プロジェクト
            </label>
            <select
              className="w-full border rounded p-2"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option>プロジェクト1</option>
              <option>プロジェクト2</option>
              <option>プロジェクト3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">月</label>
            <select
              className="w-full border rounded p-2"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>2025-05</option>
              <option>2025-04</option>
              <option>2025-03</option>
            </select>
          </div>
        </aside>

        {/* CENTER */}
        <main className="flex-1 p-6 bg-white space-y-4 overflow-y-auto">
          <h2 className="font-semibold text-lg mb-4">📋 Task List</h2>
          <p className="text-sm text-gray-600 mb-2">
            選択中: {selectedProject} / {selectedMonth}
          </p>

          {filteredTasks.length === 0 ? (
            <p className="text-sm text-gray-400">
              該当するタスクがありません。
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded shadow-sm space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{task.name}</span>
                  <span className="text-gray-500">担当: {task.assignee}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-500">
                  {task.progress}% 完了
                </p>
              </div>
            ))
          )}
        </main>

        {/* RIGHT */}
        <aside className="w-[240px] bg-blue-50 p-4">
          <h2 className="font-semibold text-lg">📈 Weekly Summary</h2>
          <ul className="mt-2 text-sm list-disc list-inside text-gray-700 space-y-1">
            <li>タスク件数: {totalTasks} 件</li>
            <li>平均進捗: {averageProgress} %</li>
            <li>未完了タスク: {incompleteCount} 件</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
