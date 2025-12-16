import "@components/layout/Lnb.css";
import { NavLink } from "react-router-dom";
import { useState, useContext, useMemo } from "react";
import LogoStyleship from "@/assets/images/common/logo_styleship.png";
import NewProject from "@components/feature/NewProject";
import { UserDataContext } from "@/App";

function Lnb() {
  const [showNewProject, setShowNewProject] = useState(false);

  const {
    alertState,
    handleAlertBtn,
    auth = { isLoggedIn: false, userId: null },
  } = useContext(UserDataContext);

  const loginUser = useMemo(() => {
    if (!auth?.isLoggedIn) return null;
    try {
      const stored = localStorage.getItem("bms_member");
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      console.error("파싱 오류", e);
      return null;
    }
  }, [auth?.isLoggedIn]);

  const memberType = loginUser?.memberType ?? 0;

  // ✅ 예시 규칙:
  // 1 = 스타일쉽 직원
  const isStaff = memberType === 1;

  // 필요하면 타입 더 추가해서 분기
  // const isPartner = memberType === 2;
  // const isAdmin = memberType === 9;

  return (
    <nav className="Lnb">
      <ul className="button-list">
        <li className="project-write">
          <button
            onClick={() => {
              setShowNewProject(true);
              handleAlertBtn();
            }}
          >
            <span className="button-icon icon-pencil"></span>
            <span className="button-name">프로젝트 생성</span>
          </button>
        </li>

        {/* ✅ 모두에게 보이게 */}
        <li>
          <NavLink
            to="/Project"
            className={({ isActive }) => (isActive ? "lnb-on" : "")}
          >
            <span className="button-icon icon-project"></span>
            <span className="button-name">프로젝트</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/MyProject"
            className={({ isActive }) => (isActive ? "lnb-on" : "")}
          >
            <span className="button-icon icon-myProject"></span>
            <span className="button-name">나의 프로젝트</span>
          </NavLink>
        </li>

        {/* ✅ 직원만 보이게 */}
        {isStaff && (
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
        )}

        {isStaff && (
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
        )}

        {isStaff && (
          <li>
            <NavLink
              to="/Hr"
              className={({ isActive }) => (isActive ? "lnb-on" : "")}
            >
              <span className="button-icon icon-hr"></span>
              <span className="button-name">인사 정보</span>
            </NavLink>
          </li>
        )}

        {isStaff && (
          <li>
            <NavLink
              to="/Setting"
              className={({ isActive }) => (isActive ? "lnb-on" : "")}
            >
              <span className="button-icon icon-setting"></span>
              <span className="button-name">설정</span>
            </NavLink>
          </li>
        )}
      </ul>

      <div className="logo-styleship">
        <NavLink to="/">
          <img src={LogoStyleship} alt="logo" />
        </NavLink>
      </div>

      {/* ✅ 직원만 프로젝트 생성 모달 열리도록 */}
      {isStaff && showNewProject && alertState === "on" && (
        <NewProject
          onClose={() => {
            setShowNewProject(false);
            handleAlertBtn();
          }}
        />
      )}
    </nav>
  );
}

export default Lnb;
