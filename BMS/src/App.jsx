import "./App.css";

import LogoStyleship from "./assets/common/logo_styleship.png";
import ProfileImg from "./assets/profile-img.JPG";

import { useState } from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";

import Home from "./pages/Home";
import Project from "./pages/Project";
import MyProject from "./pages/MyProject";
import Schedule from "./pages/Schedule";
import Knowledge from "./pages/Knowledge";
import Hr from "./pages/Hr";
import Setting from "./pages/Setting";

function App() {
  const [lnbToggle, setLnbToggle] = useState(true);
  const [attendanceToggle, setAttendanceToggle] = useState(true);

  const lnbToggleButton = () => {
    setLnbToggle((on) => !on);
  };

  const attendanceToggleButton = () => {
    setAttendanceToggle((on) => !on);
  };

  return (
    <div className={`Wrap ${lnbToggle ? "" : "lnb-off"}`}>
      {/* HEADER */}
      <header className="Header">
        {/* LNB, PROFILE */}
        <div>
          <button className="lnb-button" onClick={lnbToggleButton}>
            LNB Toggle Button
          </button>

          <div className="profile-box">
            <div className="profile-img">
              <img src={ProfileImg} alt="" />
            </div>
            <div className="profile-info">
              <p className="profile-name">홍길동</p>
              <p className="profile-status">(1.209.229.168) 접속중</p>
            </div>
          </div>
        </div>
        {/* //LNB, PROFILE */}

        {/* 출퇴근 체크, 알림 */}
        <div>
          <button
            className={`attendance-button ${
              attendanceToggle ? "attendance-active" : ""
            }`}
            onClick={attendanceToggleButton}
          >
            {`${attendanceToggle ? "퇴근체크" : "출근체크"}`}
          </button>
          <button className={`alarm-button alarm-active`}>알림</button>
        </div>
        {/* //출퇴근 체크, 알림 */}
      </header>
      {/* //HEADER */}

      <div className="ContentWrap">
        {/* LNB */}
        <nav className="Lnb">
          <ul className="button-list">
            <li className="project-write">
              <button>
                <span className="button-icon icon-pencil"></span>

                <span className="button-name">프로젝트 생성</span>
              </button>
            </li>
            <li>
              <NavLink
                to="/Project"
                className={({ isActive }) => `${isActive ? "lnb-on" : ""}`}
              >
                <span className="button-icon icon-project"></span>

                <span className="button-name">프로젝트</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/MyProject"
                className={({ isActive }) => `${isActive ? "lnb-on" : ""}`}
              >
                <span className="button-icon icon-myProject"></span>

                <span className="button-name">나의 프로젝트</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Schedule"
                className={({ isActive }) =>
                  `arrow-right ${isActive ? "lnb-on" : ""}`
                }
              >
                <span className="button-icon icon-schedule"></span>

                <span className="button-name">일정 관리</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Knowledge"
                className={({ isActive }) =>
                  `arrow-right ${isActive ? "lnb-on" : ""}`
                }
              >
                <span className="button-icon icon-knowledge"></span>

                <span className="button-name">사내 지식</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Hr"
                className={({ isActive }) => `${isActive ? "lnb-on" : ""}`}
              >
                <span className="button-icon icon-hr"></span>

                <span className="button-name">인사 정보</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Setting"
                className={({ isActive }) => `${isActive ? "lnb-on" : ""}`}
              >
                <span className="button-icon icon-setting"></span>

                <span className="button-name">설정</span>
              </NavLink>
            </li>
          </ul>

          <div className="logo-styleship">
            <NavLink to="/">
              <img src={LogoStyleship} alt="" />
            </NavLink>
          </div>
        </nav>
        {/* //LNB */}

        {/* CONTENTS */}
        <div className="Contents">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Project" element={<Project />} />
            <Route path="/MyProject" element={<MyProject />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/Knowledge" element={<Knowledge />} />
            <Route path="/Hr" element={<Hr />} />
            <Route path="/Setting" element={<Setting />} />
          </Routes>
        </div>
        {/* //CONTENTS */}
      </div>
    </div>
  );
}

export default App;
