import React from "react";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import { ja } from "date-fns/locale";
import { isHoliday } from "@holiday-jp/holiday_jp";

const GanttChart = () => {
  const getDayBgColor = (date) => {
    const day = date.getDay();
    if (isHoliday(date)) return "bg-danger-subtle";
    if (day === 0) return "bg-danger";
    if (day === 6) return "bg-info";
    return "";
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = "2024-06-15";
  const endDate = "2024-08-15";

  const tasks = [
    {
      name: "API設計",
      assignee: "佐藤",
      startDate: "2024-06-18",
      endDate: "2024-06-30",
    },
    {
      name: "DB設計",
      assignee: "山田",
      startDate: "2024-07-01",
      endDate: "2024-07-15",
    },
    {
      name: "画面実装",
      assignee: "佐脇",
      startDate: "2024-07-20",
      endDate: "2024-08-10",
    },
  ];

  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  const columnWidth = 32;
  const labelWidth = 160;
  const rowHeight = 36;

  return (
    <div className="mx-auto border" style={{ width: "1440px" }}>
      {/* 月ヘッダー */}
      <div className="d-flex border-bottom" style={{ height: rowHeight }}>
        <div
          className="border-end bg-light text-center fw-bold d-flex align-items-center justify-content-center"
          style={{ width: labelWidth }}
        >
          タスク / 担当者
        </div>
        {(() => {
          const monthSpans = [];
          let currentMonth = "";
          let count = 0;
          days.forEach((date) => {
            const month = format(date, "M月", { locale: ja });
            if (month !== currentMonth) {
              if (count > 0) {
                monthSpans.push({ month: currentMonth, span: count });
              }
              currentMonth = month;
              count = 1;
            } else {
              count++;
            }
          });
          if (count > 0) {
            monthSpans.push({ month: currentMonth, span: count });
          }

          return monthSpans.map((entry, idx) => (
            <div
              key={idx}
              className="border-end d-flex align-items-center ps-1 bg-white fw-bold"
              style={{
                width: entry.span * columnWidth,
                fontSize: 12,
              }}
            >
              {entry.month}
            </div>
          ));
        })()}
      </div>

      {/* 日付・曜日ヘッダー */}
      <div className="d-flex border-bottom" style={{ height: rowHeight }}>
        <div
          className="border-end bg-light"
          style={{ width: labelWidth }}
        ></div>
        {days.map((date, idx) => {
          const isToday = date.toDateString() === today.toDateString();
          const isMonthBoundary = date.getDate() === 1;
          const bgColor = isToday ? "bg-warning" : getDayBgColor(date);
          const borderClass = isMonthBoundary ? "border-start border-dark" : "";

          return (
            <div
              key={idx}
              className={`border-end text-center ${bgColor} ${borderClass}`}
              style={{
                width: columnWidth,
                fontSize: 10,
                lineHeight: 1.1,
              }}
            >
              <div>{format(date, "d", { locale: ja })}</div>
              <div>{format(date, "E", { locale: ja }).slice(0, 1)}</div>
            </div>
          );
        })}
      </div>

      {/* タスク行 */}
      {tasks.map((task, i) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        const offset = differenceInDays(taskStart, new Date(startDate));
        const span = differenceInDays(taskEnd, taskStart) + 1;

        const planStart = offset;
        const planSpan = span;
        const actualStart = offset;
        const actualSpan = Math.floor(span * 0.6); // 仮実績

        return (
          <div
            key={i}
            className="d-flex border-top"
            style={{ height: rowHeight }}
          >
            <div
              className="border-end bg-light px-2 d-flex align-items-center"
              style={{ width: labelWidth }}
            >
              {task.name}（{task.assignee}）
            </div>

            {days.map((date, idx) => {
              const isToday = date.toDateString() === today.toDateString();
              const isMonthBoundary = date.getDate() === 1;
              const borderClass = isMonthBoundary
                ? "border-start border-dark"
                : "";
              const bgColor = isToday ? "bg-warning" : getDayBgColor(date);

              return (
                <div
                  key={idx}
                  className={`border-end position-relative ${bgColor} ${borderClass}`}
                  style={{
                    width: columnWidth,
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  {idx >= planStart && idx < planStart + planSpan && (
                    <div
                      className="position-absolute bottom-0 w-100"
                      style={{
                        height: "50%",
                        backgroundColor: "#ccc",
                      }}
                    />
                  )}
                  {idx >= actualStart && idx < actualStart + actualSpan && (
                    <div
                      className="position-absolute top-0 w-100"
                      style={{
                        height: "50%",
                        backgroundColor: "#007bff",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GanttChart;
