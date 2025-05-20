import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import { isHoliday } from "@holiday-jp/holiday_jp";

const ScheduleCalendar = ({ wbsItems = [] }) => {
  const [baseDate, setBaseDate] = useState(new Date());
  const MAX_DAYS = 31;

  const getFixedDateList = () => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const actualDates = eachDayOfInterval({
      start: firstDay,
      end: lastDay,
    });

    const result = [];
    for (let i = 1; i <= MAX_DAYS; i++) {
      const date = actualDates.find((d) => d.getDate() === i);
      result.push(date || null);
    }
    return result;
  };

  const dateList = getFixedDateList();
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);

  const getDateHeaders = () =>
    dateList.map((d, idx) => {
      if (!d) {
        return (
          <div
            key={idx}
            className="text-center border-end"
            style={{
              width: 30,
              fontSize: "0.75rem",
              backgroundColor: "#f8f9fa",
            }}
          >
            <br />
          </div>
        );
      }

      const dayLabel = format(d, "E", { locale: ja });
      const dateLabel = format(d, "d");
      const isToday =
        format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      const isSun = d.getDay() === 0;
      const isSat = d.getDay() === 6;
      const holiday = isHoliday(d);
      const bgColor = holiday || isSun ? "#ffe5e5" : isSat ? "#e5f1ff" : "#fff";

      return (
        <div
          key={idx}
          className="text-center border-end"
          style={{
            width: 30,
            fontSize: "0.75rem",
            backgroundColor: bgColor,
            fontWeight: isToday ? "bold" : "normal",
          }}
        >
          {dateLabel}
          <br />
          <span style={{ fontSize: "0.7rem" }}>{dayLabel}</span>
        </div>
      );
    });

  const renderBar = (item) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);

    const offset = Math.max(0, Math.floor((itemStart - monthStart) / oneDay));
    const span = Math.max(1, differenceInDays(itemEnd, itemStart) + 1);
    const progress =
      item.plannedQty > 0 ? Math.min(item.actualQty / item.plannedQty, 1) : 0;

    return (
      <div
        className="position-relative bg-light rounded"
        style={{
          height: "24px",
          width: `${dateList.length * 30}px`,
        }}
      >
        <div
          className="position-absolute bg-secondary bg-opacity-25"
          style={{
            left: `${offset * 30}px`,
            width: `${span * 30}px`,
            height: "100%",
            borderRadius: "4px",
          }}
        ></div>

        <div
          className="position-absolute bg-primary"
          style={{
            left: `${offset * 30}px`,
            width: `${span * 30 * progress}px`,
            height: "100%",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    );
  };

  const calculateProgressRate = (planned, actual) => {
    if (!planned || planned === 0) return "-";
    return `${Math.round((actual / planned) * 100)}%`;
  };

  // 🔽 フィルタ: 表示月に該当する工程だけ表示
  const filteredItems = wbsItems.filter((item) => {
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);
    return itemEnd >= monthStart && itemStart <= monthEnd;
  });

  return (
    <div className="p-3 border rounded" style={{ overflowX: "auto" }}>
      <div className="d-flex justify-content-between mb-2">
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setBaseDate((prev) => subMonths(prev, 1))}
          >
            前月
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setBaseDate(new Date())}
          >
            当月
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setBaseDate((prev) => addMonths(prev, 1))}
          >
            次月
          </button>
        </div>
        <div className="text-muted">
          表示月: {format(baseDate, "yyyy年MM月")}
        </div>
      </div>

      <div style={{ minWidth: `${dateList.length * 30}px` }}>
        <div className="d-flex border-bottom">{getDateHeaders()}</div>

        {filteredItems.map((item, idx) => (
          <div key={idx} className="border-bottom px-2 py-2">
            <div className="fw-semibold mb-1">
              {item.wbsName}（{item.assignees}）—
              <span className="text-muted">
                進捗: {calculateProgressRate(item.plannedQty, item.actualQty)}
              </span>
            </div>
            {renderBar(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
