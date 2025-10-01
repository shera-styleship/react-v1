import "./App.css";

import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Project from "./pages/Project";
import MyProject from "./pages/MyProject";
import Schedule from "./pages/Schedule";
import Knowledge from "./pages/Knowledge";
import Hr from "./pages/Hr";
import Setting from "./pages/Setting";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* 로그인 전용 레이아웃 */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      {/* //로그인 전용 레이아웃 */}

      {/* 공용 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/MyProject" element={<MyProject />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Knowledge" element={<Knowledge />} />
        <Route path="/Hr" element={<Hr />} />
        <Route path="/Setting" element={<Setting />} />
      </Route>
      {/* //공용 레이아웃 */}
    </Routes>
  );
}

export default App;
