// ProjectWBSPage.jsx
import React, { useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import ja from "date-fns/locale/ja";
import { isHoliday } from "@holiday-jp/holiday_jp";

const ProjectWBSPage = () => {
  const [project, setProject] = useState({
    userName: "",
    systemName: "",
    name: "",
    client: "",
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

  const assigneeOptions = ["白井", "庄司", "倉内", "金沢", "山田", "佐藤"];
  const progressOptions = ["未着手", "進行中", "完了", "保留", "○"];
  const processOptions = {
    "03": {
      label: "マイグレーション",
      sub: [
        { code: "01", label: "事前準備等" },
        { code: "02", label: "方針検討" },
        { code: "03", label: "マイグレーション仕様" },
        { code: "04", label: "マイグレーション" },
      ],
    },
    "04": {
      label: "システムテスト",
      sub: [
        { code: "01", label: "シナリオ一覧作成" },
        { code: "02", label: "テスト仕様書作成" },
      ],
    },
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

  const isValidDate = (date) => !isNaN(new Date(date).getTime());
  const isValidNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  const renderScheduleBar = (start, end) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    if (
      isNaN(startDate) ||
      isNaN(endDate) ||
      isNaN(projectStart) ||
      isNaN(projectEnd)
    )
      return null;

    const offsetLeft = Math.max(
      0,
      Math.floor((startDate - projectStart) / oneDay)
    );
    const taskDuration = Math.max(
      1,
      Math.floor((endDate - startDate) / oneDay) + 1
    );

    return (
      <div
        className="position-relative"
        style={{ minWidth: "100%", height: "24px" }}
      >
        <div
          className="bg-primary position-absolute"
          style={{
            left: `${offsetLeft * 30}px`,
            width: `${taskDuration * 30}px`,
            height: "100%",
          }}
        ></div>
      </div>
    );
  };

  const calculateProgressRate = (planned, actual) => {
    if (!isValidNumber(planned) || planned === 0) return "-";
    const rate = Math.round((actual / planned) * 100);
    return `${rate}%`;
  };

  const getDateHeaders = () => {
    if (!isValidDate(project.startDate) || !isValidDate(project.endDate))
      return [];
    const range = eachDayOfInterval({
      start: new Date(project.startDate),
      end: new Date(project.endDate),
    });
    return range.map((d) => {
      const dayLabel = format(d, "E", { locale: ja });
      const dateLabel = format(d, "M/d");
      const isToday =
        format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      const isHolidayOrWeekend =
        isHoliday(d) || d.getDay() === 0 || d.getDay() === 6;

      return (
        <div
          key={dateLabel}
          style={{ width: "30px" }}
          className={`border-end text-center small ${
            isHolidayOrWeekend ? "text-danger" : ""
          } ${isToday ? "bg-warning-subtle fw-bold" : ""}`}
        >
          {dateLabel}
          <br />
          {dayLabel}
        </div>
      );
    });
  };

  return (
    <div className="container-fluid p-0 vh-100 overflow-hidden">
      <div className="sticky-top top-0 bg-white border-bottom py-3 px-4 z-3">
        <h2 className="h5 mb-3 fw-bold">プロジェクト情報</h2>
        <div className="row g-2 row-cols-1 row-cols-sm-2 row-cols-md-4">
          {" "}
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
              type="text"
              className="form-control"
              placeholder="クライアント名"
              value={project.client}
              onChange={(e) =>
                setProject({ ...project, client: e.target.value })
              }
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

      <h3 className="h6 mb-3 fw-semibold">WBS工程</h3>
      <div className="table-responsive">
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
      {/* ✅ スケジュールカレンダー */}
      <div className="mt-5 px-4">
        <h5 className="mb-3">スケジュールカレンダー</h5>

        {isValidDate(project.startDate) && isValidDate(project.endDate) && (
          <div
            className="border rounded overflow-x-auto overflow-y-hidden"
            style={{ maxWidth: "100%" }}
          >
            <div className="mb-2 text-muted px-3 pt-2">
              プロジェクト期間:{" "}
              {format(new Date(project.startDate), "yyyy/MM/dd")} ～{" "}
              {format(new Date(project.endDate), "yyyy/MM/dd")}
            </div>
            <div style={{ minWidth: "1000px" }}>
              <div
                className="d-flex border-bottom"
                style={{ fontSize: "0.75rem" }}
              >
                {getDateHeaders()}
              </div>
              {wbsItems.map((item, idx) => (
                <div key={idx} className="list-group-item">
                  <div className="fw-semibold mb-1">
                    {item.wbsName || "(工程未入力)"} —{" "}
                    <span className="text-muted">
                      進捗:{" "}
                      {calculateProgressRate(item.plannedQty, item.actualQty)}
                    </span>
                  </div>
                  {renderScheduleBar(item.startDate, item.endDate)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWBSPage;
