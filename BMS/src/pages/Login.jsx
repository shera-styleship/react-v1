// src/pages/Login.jsx
import "@/pages/Login.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";
import Checkbox from "@/components/common/Checkbox";
import { UserDataContext } from "@/App";
import { UserDispatchContext } from "@/App";
import styleshipLogo from "@/assets/images/common/styleship_logo.png";
import axios from "axios";

const STORAGE_KEY = "remembered_username";
const TOKEN_KEY = "bms_token"; // JWT 저장용
const MEMBER_KEY = "bms_member";
const EXPIRES_AT = "expires_at";

const Login = () => {
  const nav = useNavigate();
  const location = useLocation();

  // 🔹 RequireAuth에서 전달한 "원래 가려던 경로"
  const from = location.state?.from?.pathname || "/";

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const { handleAlertBtn } = useContext(UserDataContext);
  const { login } = useContext(UserDispatchContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLoginId(saved);
      setRememberId(true);
    }
  }, []);

  const openAlert = (content) => {
    setError(content);
    handleAlertBtn();
  };

  const handleLogin = async () => {
    const id = loginId.trim();
    const pw = loginPw.trim();

    if (!id || !pw) {
      openAlert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        "https://bmsapi.styleship.com/api/Auth/login",
        {
          username: id,
          password: pw,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, member } = res.data;

      // 토큰 및 회원정보 저장
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
      localStorage.setItem(EXPIRES_AT, Date.now() + 1000 * 60 * 30); // 30분 뒤 만료

      // 아이디 저장 처리
      if (rememberId) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);

      // 전역 로그인 처리
      if (login) {
        // login 함수 정의가 login(id) 이므로, member 전체 대신 id/키를 넘길지
        // 이미 기존 로직을 그대로 쓰고 싶다면 아래 둘 중 골라:
        // login(member.memberID);
        login(member); // ← 기존 코드 유지
      }

      // ✅ 메인 이동 (무조건 "/"가 아니라 원래 가려던 곳으로!)
      nav(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        openAlert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        openAlert("서버 로그인 오류가 발생했습니다.");
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="Login_wrap">
        <div className="Login_box">
          <img
            className="styleship_logo"
            src={styleshipLogo}
            alt="스타일쉽 로고"
          />
          <div className="Login_form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <Input
                inputPlaceholder="아이디"
                inputValue={loginId}
                setValue={setLoginId}
                inputChar="login"
              />
              <Input
                inputType="password"
                inputPlaceholder="비밀번호"
                inputValue={loginPw}
                setValue={setLoginPw}
                inputChar="login"
                toggleVisibility
              />

              <Checkbox
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              >
                아이디 저장
              </Checkbox>

              <Button btnType="submit" btnSize="big" btnChar="orange">
                로그인
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Alert title="알림" alertType={false}>
        {error}
      </Alert>
    </>
  );
};

export default Login;
