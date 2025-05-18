// ProjectWBSPage.jsx（スケジュールカレンダー簡略化版）
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import GanttRow from "../components/GanttRow";
import ScheduleCalendar from "../components/ScheduleCalendar";

const ProjectWBSPage = () => {
  const [project, setProject] = useState({
    type: "",
    userName: "",
    systemName: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const [wbsItems, setWbsItems] = useState([
    {
      majorCategory: "03",
      minorCategory: "01",
      wbsName: "事前準備等",
      assignees: "白井",
      isVendorResponsible: true,
      progress: "○",
      startDate: "2025-05-11",
      endDate: "2025-05-16",
      plannedQty: 8,
      actualQty: 5,
      inputDate: new Date().toISOString().split("T")[0],
    },
  ]);

  useEffect(() => {
    console.log("🔍 WBS Items", wbsItems);
    console.log("📅 Project Dates", project.startDate, project.endDate);
  }, [wbsItems, project]);

  const isValidDate = (date) => !isNaN(new Date(date).getTime());
  const isValidNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  const calculateProgressRate = (planned, actual) => {
    if (!isValidNumber(planned) || planned === 0) return "-";
    return `${Math.round((actual / planned) * 100)}%`;
  };

  const handleWbsChange = (index, field, value) => {
    const updated = [...wbsItems];
    updated[index][field] = value;
    setWbsItems(updated);
  };

  const addWbsRow = () => {
    setWbsItems([
      ...wbsItems,
      {
        majorCategory: "",
        minorCategory: "",
        wbsName: "",
        assignees: "",
        isVendorResponsible: false,
        progress: "",
        startDate: "",
        endDate: "",
        plannedQty: "",
        actualQty: "",
        inputDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const deleteWbsRow = (index) => {
    const updated = wbsItems.filter((_, i) => i !== index);
    setWbsItems(updated);
  };

  return (
    <div className="container-fluid p-0 vh-100 overflow-hidden">
      {/* プロジェクト情報入力 */}
      <div className="sticky-top top-0 bg-white border-bottom py-3 px-4 z-3">
        <h2 className="h5 mb-3 fw-bold">プロジェクト情報</h2>
        <div className="row g-2 row-cols-1 row-cols-sm-2 row-cols-md-4">
          {" "}
          <div className="col">
            <select
              className="form-select"
              value={project.type}
              onChange={(e) => setProject({ ...project, type: e.target.value })}
            >
              <option value="">種別を選択</option>
              <option value="国保組合">国保組合</option>
              <option value="マネキン">マネキン</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="ユーザー名"
              value={project.userName}
              onChange={(e) =>
                setProject({ ...project, userName: e.target.value })
              }
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="システム名"
              value={project.systemName}
              onChange={(e) =>
                setProject({ ...project, systemName: e.target.value })
              }
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="プロジェクト名"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={project.startDate}
              onChange={(e) =>
                setProject({ ...project, startDate: e.target.value })
              }
            />
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={project.endDate}
              onChange={(e) =>
                setProject({ ...project, endDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* WBSテーブル（編集可） */}
      <h3 className="h6 mb-3 fw-semibold px-4">WBS工程</h3>
      <div className="table-responsive px-4">
        <table className="table table-bordered table-sm align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>工程</th>
              <th>中分類</th>
              <th>工程名</th>
              <th>担当者</th>
              <th>弊社責任</th>
              <th>進捗</th>
              <th>開始日</th>
              <th>終了日</th>
              <th style={{ width: "60px" }}>予定数</th>
              <th style={{ width: "60px" }}>実績数</th>
              <th>入力日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {wbsItems.map((item, idx) => (
              <tr
                key={idx}
                className={
                  item.wbsName === "" ||
                  !isValidDate(item.startDate) ||
                  !isValidDate(item.endDate) ||
                  !isValidNumber(item.plannedQty)
                    ? "table-danger"
                    : ""
                }
              >
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.majorCategory}
                    onChange={(e) =>
                      handleWbsChange(idx, "majorCategory", e.target.value)
                    }
                  >
                    <option value="">選択</option>
                    {Object.entries(processOptions).map(([code, { label }]) => (
                      <option key={code} value={code}>
                        {code}: {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.minorCategory}
                    onChange={(e) =>
                      handleWbsChange(idx, "minorCategory", e.target.value)
                    }
                  >
                    <option value="">選択</option>
                    {(processOptions[item.majorCategory]?.sub || []).map(
                      (sub) => (
                        <option key={sub.code} value={sub.code}>
                          {sub.code}: {sub.label}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={item.wbsName}
                    onChange={(e) =>
                      handleWbsChange(idx, "wbsName", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.assignees}
                    onChange={(e) =>
                      handleWbsChange(idx, "assignees", e.target.value)
                    }
                  >
                    <option value="">選択</option>
                    {assigneeOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.isVendorResponsible}
                    onChange={(e) =>
                      handleWbsChange(
                        idx,
                        "isVendorResponsible",
                        e.target.checked
                      )
                    }
                  />
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.progress}
                    onChange={(e) =>
                      handleWbsChange(idx, "progress", e.target.value)
                    }
                  >
                    <option value="">選択</option>
                    {progressOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={item.startDate}
                    onChange={(e) =>
                      handleWbsChange(idx, "startDate", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={item.endDate}
                    onChange={(e) =>
                      handleWbsChange(idx, "endDate", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-center"
                    value={item.plannedQty}
                    onChange={(e) =>
                      handleWbsChange(
                        idx,
                        "plannedQty",
                        e.target.value.slice(0, 3)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-center"
                    value={item.actualQty}
                    onChange={(e) =>
                      handleWbsChange(
                        idx,
                        "actualQty",
                        e.target.value.slice(0, 3)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={item.inputDate}
                    onChange={(e) =>
                      handleWbsChange(idx, "inputDate", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteWbsRow(idx)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <button className="btn btn-success btn-sm me-2" onClick={addWbsRow}>
          ＋行を追加
        </button>
        <button className="btn btn-primary btn-sm">💾保存</button>
      </div>

      {/* ✅ 月間カレンダーのみ表示 */}
      <div className="mt-5 px-4">
        <ScheduleCalendar wbsItems={wbsItems} />
      </div>
    </div>
  );
};

export default ProjectWBSPage;
