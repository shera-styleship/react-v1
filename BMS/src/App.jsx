import "./normalize.css";
import "./opt-default.css";
import "./App.css";

import LogoStyleship from "./assets/common/logo_styleship.png";
import ProfileImg from "./assets/profile-img.JPG";

import { useState } from "react";
import { Link } from "react-router-dom";

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
              <Link to="">
                <span className="button-icon icon-pencil"></span>

                <span className="button-name">프로젝트 생성</span>
              </Link>
            </li>
            <li className="lnb-on">
              <Link to="">
                <span className="button-icon icon-project"></span>

                <span className="button-name">프로젝트</span>
              </Link>
            </li>
            <li>
              <Link to="">
                <span className="button-icon icon-myProject"></span>

                <span className="button-name">나의 프로젝트</span>
              </Link>
            </li>
            <li>
              <Link to="" className="arrow-right">
                <span className="button-icon icon-schedule"></span>

                <span className="button-name">일정 관리</span>
              </Link>
            </li>
            <li>
              <Link to="" className="arrow-right">
                <span className="button-icon icon-knowledge"></span>

                <span className="button-name">사내 지식</span>
              </Link>
            </li>
            <li>
              <Link to="">
                <span className="button-icon icon-hr"></span>

                <span className="button-name">인사 정보</span>
              </Link>
            </li>
            <li>
              <Link to="">
                <span className="button-icon icon-setting"></span>

                <span className="button-name">설정</span>
              </Link>
            </li>
          </ul>

          <div className="logo-styleship">
            <img src={LogoStyleship} alt="" />
          </div>
        </nav>
        {/* //LNB */}

        {/* CONTENTS */}
        <div className="Contents">
          <p
            style={{
              margin: "50px",
              fontWeight: 700,
              fontSize: "36px",
            }}
          >
            Contents
          </p>
        </div>
        {/* //CONTENTS */}
      </div>
    </div>
  );
}

export default App;
