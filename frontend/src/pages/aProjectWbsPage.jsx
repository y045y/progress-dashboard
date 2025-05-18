// ProjectWBSPage.jsx - 前月・当月・次月切り替え対応ガントチャート
import React, { useState, useEffect } from "react";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import ja from "date-fns/locale/ja";
import { isHoliday } from "@holiday-jp/holiday_jp";
import GanttRow from "../components/GanttRow";
import ScheduleCalendar from "../components/ScheduleCalendar";

const ProjectWBSPage = () => {
  const [project, setProject] = useState({
    type: "",
    userName: "",
    systemName: "",
    name: "",
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

  const [baseDate, setBaseDate] = useState(new Date("2025-05-01"));

  const dateList = eachDayOfInterval({
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate),
  });

  useEffect(() => {
    console.log("🔍 WBS Items", wbsItems);
  }, [wbsItems]);

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

  const calculateProgressRate = (planned, actual) => {
    if (!isValidNumber(planned) || planned === 0) return "-";
    const rate = Math.round((actual / planned) * 100);
    return `${rate}%`;
  };

  const getDateHeaders = () => {
    return dateList.map((d) => {
      const dayLabel = format(d, "E", { locale: ja });
      const dateLabel = format(d, "M/d");
      const isToday =
        format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      const isSunday = d.getDay() === 0;
      const isSaturday = d.getDay() === 6;
      const holiday = isHoliday(d);

      return (
        <div
          key={dateLabel}
          style={{ width: "30px" }}
          className={`border-end text-center small ${
            isSunday || holiday
              ? "text-danger"
              : isSaturday
              ? "text-primary"
              : ""
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
        </div>
      </div>

      <div className="mt-3 text-end px-4">
        <button
          className="btn btn-outline-secondary btn-sm me-2"
          onClick={() => setBaseDate(subMonths(baseDate, 1))}
        >
          ← 前月
        </button>
        <button
          className="btn btn-outline-secondary btn-sm me-2"
          onClick={() => setBaseDate(new Date())}
        >
          今月
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setBaseDate(addMonths(baseDate, 1))}
        >
          次月 →
        </button>
      </div>

      <div className="mt-5 px-4">
        <h5 className="mb-3">スケジュールカレンダー（月間表示）</h5>

        <div className="border rounded overflow-x-auto">
          <div className="mb-2 text-muted px-3 pt-2">
            表示対象: {format(dateList[0], "yyyy/MM/dd")} ～{" "}
            {format(dateList[dateList.length - 1], "yyyy/MM/dd")}
          </div>

          <div style={{ minWidth: `${dateList.length * 30}px` }}>
            <div
              className="d-flex border-bottom"
              style={{ fontSize: "0.75rem", height: "40px" }}
            >
              {getDateHeaders()}
            </div>

            {wbsItems.map((item, idx) => (
              <div
                key={idx}
                className="border-bottom px-2 py-2"
                style={{ minWidth: `${dateList.length * 30}px` }}
              >
                <div className="fw-semibold mb-1">
                  {item.wbsName || "(工程未入力)"} —{" "}
                  <span className="text-muted">
                    進捗:{" "}
                    {calculateProgressRate(item.plannedQty, item.actualQty)}
                  </span>
                </div>
                <GanttRow item={item} dateList={dateList} />
                <ScheduleCalendar wbsItems={wbsItems} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWBSPage;
