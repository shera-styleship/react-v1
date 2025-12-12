// src/App.jsx
import "@/App.css";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { useState, createContext, useEffect, useContext } from "react";

import Home from "@/pages/Home";
import Project from "@/pages/Project";
import MyProject from "@/pages/MyProject";
import Schedule from "@/pages/Schedule";
import Knowledge from "@/pages/Knowledge";
import Hr from "@/pages/Hr";
import Setting from "@/pages/Setting";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";

import { API_BASE } from "@/utils/env";

// 컨텍스트
export const UserDataContext = createContext();
export const UserDispatchContext = createContext();

// 로그인 안되어 있을 경우 /login 으로 이동
function RequireAuth() {
  const { auth, authInitialized } = useContext(UserDataContext);
  const location = useLocation();

  // ✅ 아직 로컬스토리지 체크 중이면 아무것도 하지 않기
  if (!authInitialized) {
    return null; // 필요하면 스피너 같은 로딩 컴포넌트 넣어도 됨
  }

  if (!auth?.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// 로그인 되어 있을 경우 / 홈으로 이동
function RequireGuest() {
  const { auth, authInitialized } = useContext(UserDataContext);

  if (!authInitialized) {
    return null;
  }

  if (auth?.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  const [userData, setUserData] = useState([]); // 서버의 사용자 목록

  const [auth, setAuth] = useState({ isLoggedIn: false, userId: null });
  const [authInitialized, setAuthInitialized] = useState(false); // 🔥 추가

  const [alertState, setAlertState] = useState("");

  // 프로젝트 갱신 관련 상태
  const [projectRefresh, setProjectRefresh] = useState(false);
  const refreshProjects = () => setProjectRefresh((prev) => !prev);

  const handleAlertBtn = () =>
    setAlertState((prev) => (prev === "on" ? "" : "on"));

  useEffect(() => {
    const token = localStorage.getItem("bms_token");
    const member = localStorage.getItem("bms_member");
    const expiresAt = localStorage.getItem("expires_at");

    // 기본값
    let nextAuth = { isLoggedIn: false, userId: null };

    if (token && member && expiresAt && Date.now() <= Number(expiresAt)) {
      try {
        const user = JSON.parse(member);
        nextAuth = {
          isLoggedIn: true,
          userId: user.memberID,
        };
      } catch (e) {
        console.error("member 파싱 실패:", e);
      }
    } else {
      // 만료 또는 누락 → 깔끔히 정리
      localStorage.removeItem("bms_token");
      localStorage.removeItem("bms_member");
      localStorage.removeItem("expires_at");
    }

    setAuth(nextAuth);
    setAuthInitialized(true); // 🔥 로컬스토리지 체크 끝!
  }, []);

  const login = (id) => {
    setAuth({ isLoggedIn: true, userId: id });
    setAuthInitialized(true);
  };

  const logout = () => {
    localStorage.removeItem("bms_token");
    localStorage.removeItem("bms_member");
    localStorage.removeItem("expires_at");
    setAuth({ isLoggedIn: false, userId: null });
    setAuthInitialized(true);
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        auth,
        authInitialized, // 🔥 컨텍스트로 전달
        alertState,
        handleAlertBtn,
        projectRefresh,
        refreshProjects,
      }}
    >
      <UserDispatchContext.Provider value={{ login, logout }}>
        <Routes>
          {/* 비로그인 전용: 로그인 페이지 */}
          <Route element={<RequireGuest />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>

          {/* 로그인 필요: 메인 앱 */}
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              {/* 기본 진입 = 프로젝트 */}
              <Route index element={<Project />} />
              <Route path="/" element={<Project />} />

              <Route path="/logout" element={<Logout />} />

              {/* 🔥 project 라우트 (소문자) */}
              <Route path="/project" element={<Project />} />
              <Route path="/project/:projectNo" element={<Project />} />

              <Route path="/MyProject" element={<MyProject />} />
              <Route path="/Schedule" element={<Schedule />} />
              <Route path="/Knowledge" element={<Knowledge />} />
              <Route path="/Hr" element={<Hr />} />
              <Route path="/Setting" element={<Setting />} />
            </Route>
          </Route>

          {/* 기타 경로 정리 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserDispatchContext.Provider>
    </UserDataContext.Provider>
  );
}

export default App;
