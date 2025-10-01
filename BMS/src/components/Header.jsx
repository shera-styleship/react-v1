import ProfileImg from "../assets/profile-img.JPG";

function Header({ attendanceToggle, onAttendanceToggle, onLnbToggle }) {
  return (
    <header className="Header">
      {/* LNB, PROFILE */}
      <div>
        <button className="lnb-button" onClick={onLnbToggle}>
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

      {/* 출퇴근 체크, 알림 */}
      <div>
        <button
          className={`attendance-button ${
            attendanceToggle ? "attendance-active" : ""
          }`}
          onClick={onAttendanceToggle}
        >
          {attendanceToggle ? "퇴근체크" : "출근체크"}
        </button>
        <button className="alarm-button alarm-active">알림</button>
      </div>
    </header>
  );
}

export default Header;
