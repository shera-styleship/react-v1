import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/form/Input";
import Button from "../components/form/Button";
import Alert from "../components/layer/Alert";
import { UserDataContext } from "../App";
import { UserDispatchContext } from "../App";

const Login = () => {
  const nav = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const { userData, handleAlertBtn } = useContext(UserDataContext);
  const { login } = useContext(UserDispatchContext);

  const [error, setError] = useState("");

  const openAlert = (content) => {
    setError(content);
    handleAlertBtn();
  };
  const handleLogin = () => {
    // 입력된 아이디 양끝 공백 제거
    const id = loginId.trim();
    // 입력된 비밀번호 양끝 공백 제거
    const pw = loginPw.trim();

    if (!id || !pw) {
      // 아이디/비밀번호 둘 중 하나라도 비면 사용자에게 알림
      openAlert("아이디와 비밀번호를 입력하세요.");
      // 더 진행하지 않고 함수 종료(조기 반환)
      return;
    }

    // 아이디가 일치하는 사용자 찾기(없으면 undefined)
    const user = userData.find((u) => u.userId === id);

    if (!user) {
      // 해당 아이디의 사용자가 없으면 알리고 리턴
      openAlert("해당 아이디가 존재하지 않습니다.");
      return;
    }

    if (user.userPassword !== pw) {
      // 비밀번호가 저장된 것과 다르면 알리고 리턴
      openAlert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (login) {
      // 전역 로그인을 위해 login함수 실행
      login(user.id);
    }

    nav("/"); // 홈으로 이동
  };

  // const handleJoin = () => {
  // 	nav('/join');
  // };
  return (
    <>
      <div className="Login_wrap">
        <div className="Login_box">
          <img
            className="styleship_logo"
            src="/images/styleship_logo.png"
            alt="스타일쉽 로고"
          />
          <div className="Login_form">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 새로고침 막기
                handleLogin(); // 기존 함수 실행
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
              <label className="Login_id_remember">
                <input type="checkbox" />
                <span className="Login_id_remember_checkbox"></span>
                아이디 저장
              </label>

              {/* 로그인 버튼은 type="submit"으로 변경 */}
              <Button btnType="submit" btnSize="big" btnChar="orange">
                로그인
              </Button>
            </form>
          </div>
          {/* <Button onClick={handleJoin} btnSize='big' btnChar='white'>
						회원가입
					</Button> */}
        </div>
      </div>
      <Alert title="알림" alertType={false}>
        {error}
      </Alert>
    </>
  );
};

export default Login;
