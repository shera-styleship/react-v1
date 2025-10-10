// src/App.jsx
import "./App.css";

import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import { useState, useRef, useReducer, createContext, useEffect } from "react";

import Home from "./pages/Home";
import Project from "./pages/Project";
import MyProject from "./pages/MyProject";
import Schedule from "./pages/Schedule";
import Knowledge from "./pages/Knowledge";
import Hr from "./pages/Hr";
import Setting from "./pages/Setting";
import Login from "./pages/Login";

// 리듀서는 기존 그대로 유지
function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      // 뒤에 붙이려면 [...state, action.data], 앞에 붙이려면 [action.data, ...state]
      return [...state, action.data];
    case "UPDATE":
      // user라는 인수를 주고, 해당 user의 id값이 수정한 데이터의 id 값과 일치한다면 수정한 데이터를 반환하고 아니면 기존 데이터를 반환
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

function App() {
  // 서버에서 받은 id가 1,2,3이라면 이후 로컬 생성시 4부터 이어지도록 초기값 3
  const idRef = useRef(3);

  // 초기값은 빈 배열: 서버에서 받아온 뒤 CREATE로 채워넣음
  const [userData, dispatch] = useReducer(reducer, []);

  const [auth, setAuth] = useState({ isLoggedIn: false, userId: null });
  const [alertState, setAlertState] = useState("");

  const handleAlertBtn = () => {
    setAlertState((prev) => (prev === "on" ? "" : "on"));
  };

  // 최초 1회: json-server(users)에서 목록을 불러와 CREATE로 하이드레이트
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/userInfo");
        if (!res.ok) throw new Error("Failed to load users");
        const list = await res.json();

        // 서버 데이터로 리듀서 상태를 채움(리듀서는 그대로 유지)
        list.forEach((u) => {
          dispatch({ type: "CREATE", data: u });
        });

        // 이후 onCreate에서 사용할 idRef를 서버의 최대 id 다음으로 맞춰줌
        const maxId = list.reduce(
          (m, u) => Math.max(m, Number(u.id)),
          Number.NEGATIVE_INFINITY
        );
        if (Number.isFinite(maxId)) {
          idRef.current = maxId + 1;
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 아래 3개 액션은 지금 단계에선 "로컬 상태만" 변경 (서버 동기화는 다음 단계에서 붙일 수 있음)
  const onCreate = (user) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        ...user,
      },
    });
  };

  const onUpdate = (id, patch) => {
    const original = userData.find((user) => String(user.id) === String(id));
    if (!original) return;
    dispatch({
      type: "UPDATE",
      data: { ...original, ...patch, id },
    });
  };

  // 로그인/로그아웃은 기존대로 유지 (실서비스는 서버 인증 권장)
  const login = (id) => {
    setAuth({ isLoggedIn: true, userId: id });
  };
  const logout = () => {
    setAuth({ isLoggedIn: false, userId: null });
  };

  return (
    <>
      <UserDataContext.Provider
        value={{ userData, auth, alertState, handleAlertBtn }}
      >
        <UserDispatchContext.Provider
          value={{ onCreate, login, logout, onUpdate }}
        >
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
        </UserDispatchContext.Provider>
      </UserDataContext.Provider>
    </>
  );
}

export default App;
