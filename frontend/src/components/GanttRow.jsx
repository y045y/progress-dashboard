import React from "react";
import { eachDayOfInterval } from "date-fns";

// 時刻を除去して日付だけ比較できるようにする関数
const stripTime = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const GanttRow = ({ item, projectStart, projectEnd }) => {
  // 入力のバリデーション
  if (!item?.startDate || !item?.endDate || !projectStart || !projectEnd)
    return null;

  const startDate = stripTime(item.startDate);
  const endDate = stripTime(item.endDate);
  const startProj = stripTime(projectStart);
  const endProj = stripTime(projectEnd);

  const cellWidth = 30; // 1日あたりのピクセル幅

  // プロジェクト全体の横幅（日数ベースで幅を決定）
  const projectDays = eachDayOfInterval({ start: startProj, end: endProj });
  const totalWidth = projectDays.length * cellWidth;

  // 範囲外のタスクは表示しない
  if (endDate < startProj || startDate > endProj) {
    console.warn("⛔ タスクがプロジェクト期間外のため非表示", {
      taskStart: item.startDate,
      taskEnd: item.endDate,
      projectStart,
      projectEnd,
    });
    return null;
  }

  // オフセットと長さ（日数）を計算
  const offsetDays = Math.max(
    0,
    Math.floor((startDate - startProj) / (1000 * 60 * 60 * 24))
  );
  const durationDays = Math.max(
    1,
    Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  );

  console.log("✅ Gantt描画", {
    name: item.wbsName,
    offset: offsetDays,
    span: durationDays,
    totalDays: projectDays.length,
  });

  return (
    <div
      className="position-relative"
      style={{ width: totalWidth, height: 24 }}
    >
      <div
        className="position-absolute bg-primary"
        style={{
          left: offsetDays * cellWidth,
          width: durationDays * cellWidth,
          height: "100%",
        }}
      />
    </div>
  );
};

export default GanttRow;
