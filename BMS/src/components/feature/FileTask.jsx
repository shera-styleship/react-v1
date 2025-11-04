import "@components/feature/FileTask.css";
import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "@/App";
import { API_BASE } from "@/utils/env";

const getFormattedDate = (isoDate) => {
  const date = new Date(isoDate);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const day = days[date.getDay()];
  return `${y}-${m}-${d} ${day}요일`;
};

const getFormattedTime = () => {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h > 12 ? "오후" : "오전"} ${h % 12 || 12}:${m}`;
};

const FileTask = ({ projectId }) => {
  const { userData, auth } = useContext(UserDataContext);
  const currentUser = userData.find((u) => u.id === auth.userId);
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

// 파일 목록 불러오기
useEffect(() => {
    if (!projectId) return;
    fetch(`${API_BASE}/comments?projectId=${projectId}`)
        .then((res) => res.json())
        .then((data) => {
        const fileOnly = data.filter((item) => item.file === true);
        setFiles(fileOnly);
        })
        .catch((err) => console.error("파일 로드 실패:", err));
}, [projectId]);

  // 파일 업로드
  const handleFileUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const newFile = {
      projectId: Number(projectId),
      userId: currentUser.id,
      type: "_us",
      name: currentUser.userName,
      file: true,
      createdAt: new Date().toISOString(),
      time: getFormattedTime(),
      text: file.name,
    };

    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFile),
    });

    const saved = await res.json();
    setFiles((prev) => [...prev, saved]);
    e.target.value = "";
  };

  // 날짜별 그룹화
  const groupedByDate = files.reduce((acc, f) => {
    const dateKey = getFormattedDate(f.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(f);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a.split(" ")[0]) - new Date(b.split(" ")[0])
  );

  const handleFileDownload = (fileName) => {
    const fileUrl = `/uploads/${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="FileTask">
      <div className="file-list">
        {sortedDates.length === 0 ? (
          <p className="no-txt">등록된 파일이 없습니다.</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <p className="date-indicator">{date}</p>
              <div className="wrap">
                {groupedByDate[date].map((f) => (
                  <div key={f.id} className="file">
                    <div className="info-box">
                      <p className="user-name">{f.name}</p>
                      <p className="time">{f.time}</p>
                    </div>
                    <div
                      className="down-box"
                      onClick={() => handleFileDownload(f.text)}
                    >
                      <p>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="file-input">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="file-upload__btn"
          onClick={handleFileUploadClick}
        >
          파일첨부
        </button>
      </div>
    </div>
  );
};

export default FileTask;
