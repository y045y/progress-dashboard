import GanttChart from "./components/GanttChart";
// import DashboardPage from "./pages/DashboardPage";
// import TaskManagerPage from "./pages/TaskManagerPage";
import ProjectWBSPage from "./pages/ProjectWbsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestCalendarPage from "./pages/TestCalendarPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* <TestCalendarPage/> */}
      <ProjectWBSPage />
      {/* <GanttChart /> */}
      {/* <TaskManagerPage />
      <hr />
      <DashboardPage /> */}
    </div>
  );
}

export default App;
