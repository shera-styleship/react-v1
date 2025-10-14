// src/App.jsx
import "./App.css";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import {
  useState,
  useRef,
  useReducer,
  createContext,
  useEffect,
  useContext,
} from "react";

import Home from "./pages/Home";
import Project from "./pages/Project";
import MyProject from "./pages/MyProject";
import Schedule from "./pages/Schedule";
import Knowledge from "./pages/Knowledge";
import Hr from "./pages/Hr";
import Setting from "./pages/Setting";
import Login from "./pages/Login";

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [...state, action.data];
    case "UPDATE":
      return state.map((user) =>
        String(user.id) === String(action.data.id) ? action.data : user
      );
    case "DELETE":
      return state.filter((user) => String(user.id) !== String(action.id));
    default:
      return state;
  }
}
export const UserDataContext = createContext();
export const UserDispatchContext = createContext();

// 로그인 안되어 있을 경우 /login 으로 이동
function RequireAuth() {
  const { auth } = useContext(UserDataContext);
  const location = useLocation();
  if (!auth?.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// 로그인 되어 있을 경우 / 홈으로 이동
function RequireGuest() {
  const { auth } = useContext(UserDataContext);
  if (auth?.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

function App() {
  const idRef = useRef(3);
  const [userData, dispatch] = useReducer(reducer, []);

  const [auth, setAuth] = useState({ isLoggedIn: false, userId: null });
  const [alertState, setAlertState] = useState("");

  const handleAlertBtn = () =>
    setAlertState((prev) => (prev === "on" ? "" : "on"));

  // 서버 데이터 하이드레이트
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/userInfo");
        if (!res.ok) throw new Error("Failed to load users");
        const list = await res.json();
        list.forEach((u) => dispatch({ type: "CREATE", data: u }));
        const maxId = list.reduce(
          (m, u) => Math.max(m, Number(u.id)),
          -Infinity
        );
        if (Number.isFinite(maxId)) idRef.current = maxId + 1;
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const onCreate = (user) => {
    dispatch({ type: "CREATE", data: { id: idRef.current++, ...user } });
  };
  const onUpdate = (id, patch) => {
    const original = userData.find((u) => String(u.id) === String(id));
    if (!original) return;
    dispatch({ type: "UPDATE", data: { ...original, ...patch, id } });
  };

  const login = (id) => setAuth({ isLoggedIn: true, userId: id });
  const logout = () => setAuth({ isLoggedIn: false, userId: null });

  return (
    <UserDataContext.Provider
      value={{ userData, auth, alertState, handleAlertBtn }}
    >
      <UserDispatchContext.Provider
        value={{ onCreate, login, logout, onUpdate }}
      >
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
              <Route index element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/Project" element={<Project />} />
              <Route path="/MyProject" element={<MyProject />} />
              <Route path="/Schedule" element={<Schedule />} />
              <Route path="/Knowledge" element={<Knowledge />} />
              <Route path="/Hr" element={<Hr />} />
              <Route path="/Setting" element={<Setting />} />
            </Route>
          </Route>

          {/* 기타 경로는 로그인/홈으로 정리 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserDispatchContext.Provider>
    </UserDataContext.Provider>
  );
}

export default App;
