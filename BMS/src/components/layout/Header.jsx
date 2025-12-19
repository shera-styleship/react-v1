import "@components/layout/Header.css";
import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { UserDataContext } from "@/App";
import PublicIP from "@components/network/PublicIP";
import { getUserImageSrc } from "@/utils/getUserImageSrc";
import Alarm from "@components/common/Alarm";
import Alert from "@components/common/Alert";

function Header({ attendanceToggle, onAttendanceToggle, onLnbToggle }) {
  const { auth, alertState, handleAlertBtn } = useContext(UserDataContext);

  const [isAlarm, setIsAlarm] = useState(false);

  // 이번 Alert가 "출근/퇴근 확인"용인지 표시
  const [isAttendancePrompt, setIsAttendancePrompt] = useState(false);

  // Alert 안에서 사용자가 누른 버튼 기록: "confirm" | "cancel" | null
  const lastActionRef = useRef(null);

  const loginUser = useMemo(() => {
    if (!auth?.isLoggedIn) return null;
    try {
      const stored = localStorage.getItem("bms_member");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [auth?.isLoggedIn]);

  const imgSrc = useMemo(
    () => getUserImageSrc(loginUser?.userImage),
    [loginUser?.userImage]
  );

  const handleAlarmToggle = () => setIsAlarm((prev) => !prev);

  // 출근/퇴근 버튼 클릭 → Alert 열기만
  const handleAttendanceClick = () => {
    lastActionRef.current = null; // 이전 클릭 결과 초기화
    setIsAttendancePrompt(true); // 이번 알럿은 출근/퇴근용
    handleAlertBtn(); // Alert open
  };

  // Alert 내부 버튼 클릭(확인/취소)을 Header에서 가로채서 기록
  useEffect(() => {
    if (!(isAttendancePrompt && alertState === "on")) return;

    const onDocClickCapture = (e) => {
      // Alert 버튼 영역(.alert_btn) 안의 버튼 클릭만 추적
      const btnWrap = e.target.closest(".alert_btn");
      if (!btnWrap) return;

      const btn = e.target.closest("button");
      if (!btn) return;

      const text = (btn.innerText || "").trim();

      if (text.includes("확인")) lastActionRef.current = "confirm";
      else if (text.includes("취소")) lastActionRef.current = "cancel";
    };

    // 캡처 단계로 먼저 기록 (Alert 내부 onClick보다 먼저 실행)
    document.addEventListener("click", onDocClickCapture, true);

    return () => {
      document.removeEventListener("click", onDocClickCapture, true);
    };
  }, [isAttendancePrompt, alertState]);

  // Alert가 닫힐 때(= alertState === "") 확인/취소 결과에 따라 실행
  useEffect(() => {
    if (!isAttendancePrompt) return;
    if (alertState !== "") return; // 닫힌 순간만 처리

    const action = lastActionRef.current;

    // 닫힘 처리 후에는 항상 초기화 (중복 실행 방지)
    lastActionRef.current = null;
    setIsAttendancePrompt(false);

    if (action !== "confirm") return; // 취소/바깥 클릭이면 아무것도 안 함

    // 버튼 텍스트 기준으로 "다음 상태" 계산
    // attendanceToggle === true  -> 현재 "출근체크" 버튼 상태 -> 확인하면 근무중(true)
    // attendanceToggle === false -> 현재 "퇴근체크" 버튼 상태 -> 확인하면 근무종료(false)
    const nextIsWorking = attendanceToggle ? true : false;

    // 지금은 백엔드 대신 console.log로만 검증
    console.log(`userId : ${auth?.userId}, isWorking : ${nextIsWorking}`);

    // 실제 UI 토글(나중에 API 붙이면 성공 후에만 토글로 교체)
    onAttendanceToggle();
  }, [
    alertState,
    isAttendancePrompt,
    attendanceToggle,
    onAttendanceToggle,
    auth?.userId,
  ]);

  return (
    <header className="Header">
      <div>
        <button className="lnb-button" onClick={onLnbToggle}>
          LNB Toggle Button
        </button>

        <div className="profile-box">
          <div className="profile-img">
            <img
              src={imgSrc}
              alt={loginUser?.memberName || "게스트"}
              onError={(e) => (e.currentTarget.src = "/images/default.png")}
            />
          </div>
          <div className="profile-info">
            <p className="profile-name">{loginUser?.memberName || "게스트"}</p>
            <p className="profile-status">
              (<PublicIP />) 접속중
            </p>
          </div>
        </div>
      </div>

      <div>
        {loginUser?.memberType === 1 && (
          <>
            <button
              className={`attendance-button ${
                attendanceToggle ? "" : "attendance-active"
              }`}
              onClick={handleAttendanceClick}
            >
              {attendanceToggle ? "출근체크" : "퇴근체크"}
            </button>

            {/* Alert는 공통 그대로 사용 (수정 없음) */}
            <Alert title="안녕하세요" alertType={true}>
              {attendanceToggle
                ? "출근체크 하시겠습니까?"
                : "퇴근체크 하시겠습니까?"}
            </Alert>
          </>
        )}

        <button
          className="alarm-button alarm-active"
          onClick={handleAlarmToggle}
        >
          알림
        </button>

        {isAlarm && <Alarm />}
      </div>
    </header>
  );
}

export default Header;
