import React from "react";
import ScheduleCalendar from "../components/ScheduleCalendar";

const TestCalendarPage = () => {
  const wbsItems = [
    {
      wbsName: "要件定義",
      assignees: "佐藤",
      startDate: "2025-05-01",
      endDate: "2025-05-05",
      plannedQty: 5,
      actualQty: 5,
    },
    {
      wbsName: "基本設計",
      assignees: "山田",
      startDate: "2025-05-06",
      endDate: "2025-05-14",
      plannedQty: 9,
      actualQty: 7,
    },
    {
      wbsName: "詳細設計",
      assignees: "佐脇",
      startDate: "2025-05-10",
      endDate: "2025-05-20",
      plannedQty: 11,
      actualQty: 6,
    },
    {
      wbsName: "実装",
      assignees: "金沢",
      startDate: "2025-05-15",
      endDate: "2025-05-27",
      plannedQty: 13,
      actualQty: 9,
    },
    {
      wbsName: "単体テスト",
      assignees: "庄司",
      startDate: "2025-05-20",
      endDate: "2025-05-31",
      plannedQty: 12,
      actualQty: 8,
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📅 スケジュールテスト</h2>
      <ScheduleCalendar wbsItems={wbsItems} />
    </div>
  );
};

export default TestCalendarPage;
