import React, { useState, useEffect } from "react";
import { mockTasks } from "../mock/mockTasks";

const MyTaskInputPage = () => {
  const [task, setTask] = useState({
    project: "",
    name: "",
    startDate: "",
    endDate: "",
    plannedCount: "",
    actualCount: "",
    unit: "本",
  });

  const [taskList, setTaskList] = useState([]); // ✅ useEffectの前に移動
  const currentUser = "佐藤";

  useEffect(() => {
    const filtered = mockTasks.filter((t) => t.assignee === currentUser);
    setTaskList(filtered);
  }, []);

  const projectOptions = [
    "請求管理システム",
    "販売分析システム",
    "在庫管理システム",
  ];

  const handleChange = (field, value) => {
    setTask({ ...task, [field]: value });
  };

  const handleSubmit = () => {
    if (!task.project || !task.name || !task.startDate || !task.endDate) {
      alert("必須項目が未入力です。");
      return;
    }
    setTaskList([
      ...taskList,
      { ...task, assignee: currentUser, id: Date.now() },
    ]);

    setTask({
      project: "",
      name: "",
      startDate: "",
      endDate: "",
      plannedCount: "",
      actualCount: "",
      unit: "本",
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📝 Myタスク登録</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">プロジェクト</label>
          <select
            className="w-full border rounded p-2"
            value={task.project}
            onChange={(e) => handleChange("project", e.target.value)}
          >
            <option value="">選択してください</option>
            {projectOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">タスク名</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={task.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">開始日</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={task.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">終了日</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={task.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">予定数</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={task.plannedCount}
            onChange={(e) => handleChange("plannedCount", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">実績数</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={task.actualCount}
            onChange={(e) => handleChange("actualCount", e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ＋登録
      </button>

      <hr className="my-6" />

      <h2 className="text-lg font-semibold mb-3">🗂 登録済タスク</h2>
      <ul className="space-y-2">
        {taskList.map((t) => (
          <li
            key={t.id}
            className="border p-3 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">
                ({t.project}) {t.startDate} ～ {t.endDate}
                <br />
                👤 担当: {t.assignee}
              </div>
            </div>
            <div className="text-right text-sm">
              {t.actualCount}/{t.plannedCount} {t.unit}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTaskInputPage;
