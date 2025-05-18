import React, { useState } from "react";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { ja } from "date-fns/locale";
import { isHoliday } from "@holiday-jp/holiday_jp";
import GanttRow from "./GanttRow"; // ← 相対パス調整

const ScheduleCalendar = ({ wbsItems }) => {
  const [baseDate, setBaseDate] = useState(new Date());

  const dateList = eachDayOfInterval({
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate),
  });

  const getDateHeaders = () =>
    dateList.map((d) => {
      const dayLabel = format(d, "E", { locale: ja });
      const dateLabel = format(d, "M/d");
      const isToday =
        format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      const isSun = d.getDay() === 0;
      const isSat = d.getDay() === 6;
      const holiday = isHoliday(d);
      return (
        <div
          key={dateLabel}
          style={{ width: 30 }}
          className={`border-end text-center small ${
            isSun || holiday ? "text-danger" : isSat ? "text-primary" : ""
          } ${isToday ? "bg-warning-subtle fw-bold" : ""}`}
        >
          {dateLabel}
          <br />
          {dayLabel}
        </div>
      );
    });

  return (
    <div className="mt-5 px-4">
      <h5 className="mb-3">スケジュールカレンダー（月間表示）</h5>

      <div className="text-end mb-2">
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

      <div className="border rounded overflow-x-auto">
        <div className="mb-2 text-muted px-3 pt-2">
          表示対象: {format(dateList[0], "yyyy/MM/dd")} ～{" "}
          {format(dateList.at(-1), "yyyy/MM/dd")}
        </div>

        <div style={{ minWidth: `${dateList.length * 30}px` }}>
          <div
            className="d-flex border-bottom"
            style={{ fontSize: "0.75rem", height: "40px" }}
          >
            {getDateHeaders()}
          </div>

          {wbsItems.map((item, idx) => (
            <div key={idx} className="border-bottom px-2 py-2">
              <div className="fw-semibold mb-1">
                {item.wbsName || "(工程未入力)"} —{" "}
                <span className="text-muted">
                  進捗:{" "}
                  {item.plannedQty
                    ? `${Math.round((item.actualQty / item.plannedQty) * 100)}%`
                    : "-"}
                </span>
              </div>
              <GanttRow item={item} dateList={dateList} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
