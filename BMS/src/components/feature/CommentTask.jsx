// src/components/feature/CommentTask.jsx
import "@components/feature/CommentTask.css";
import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { UserDataContext } from "@/App";
import Mentions from "@components/feature/Mentions.jsx";
import { API_BASE } from "@/utils/env";
import TeamSorting from "@components/feature/TeamSorting";

// ✅ 날짜 포맷팅
const getFormattedDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date)) return "";
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const day = days[date.getDay()];
  return `${y}-${m}-${d} ${day}요일`;
};

// ✅ 시간 포맷팅 (오전/오후 HH:mm)
const getFormattedTime = (isoDate) => {
  const date = new Date(isoDate);
  if (isNaN(date)) return "";
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours >= 12 ? "오후" : "오전"} ${hours % 12 || 12}:${minutes}`;
};

// ✅ HTML Escape (dangerouslySetInnerHTML 안전 + 크래시/하얀화면 방지에 도움)
const escapeHtml = (str) => {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ✅ 멘션 포맷 + 줄바꿈 처리
//   "@[홍길동](id)" → <span class="mention">@홍길동</span>
//   "\n" → <br/>
const humanizeMentions = (text) => {
  const safe = escapeHtml(text);
  return safe
    .replace(/\@\[(.+?)\]\((.+?)\)/g, `<span class="mention">@$1</span>`)
    .replace(/\n/g, "<br/>");
};

const CommentTask = ({
  projectId,
  projectCompany,
  projectTitle,
  workTeam,
  onSaveWorkTeam,
}) => {
  const { userData, auth } = useContext(UserDataContext);

  // 1) userData에서 로그인 유저 찾기 (userId 우선, 없으면 id)
  let currentUser =
    (userData || []).find(
      (u) => String(u.userId ?? u.id) === String(auth?.userId)
    ) || null;

  // 2) userData가 비어 있거나 찾지 못했을 때 → auth 정보로 임시 유저 생성
  if (!currentUser && auth?.userId) {
    currentUser = {
      id: auth.userId,
      userId: auth.userId,
      userName: auth.userName || auth.userId,
      userImage: auth.userImage || "/images/default.png",
      userCompany: auth.userCompany || "STYLESHIP",
    };
  }

  const [comments, setComments] = useState([]);
  const [activeOption, setActiveOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAssignOpen, setAssignOpen] = useState(false);

  const commentEndRef = useRef(null);
  const optionRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ userMap 캐싱 (id → 사용자 정보)
  const userMap = useMemo(() => {
    const base = Object.fromEntries(
      (userData || []).map((u) => [String(u.id), u])
    );

    if (currentUser) {
      const key = String(currentUser.id);
      if (!base[key]) base[key] = currentUser;
    }

    return base;
  }, [userData, currentUser]);

  // ✅ 댓글 데이터 불러오기
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);

    fetch(`${API_BASE}/comments?projectId=${String(projectId)}`)
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        const withDate = (data || []).map((c) => ({
          ...c,
          createdAt: c.createdAt || new Date().toISOString(),
          text: String(c.text ?? ""),
        }));
        setComments(withDate);
      })
      .catch((err) => console.error("코멘트 로드 실패:", err))
      .finally(() => setLoading(false));
  }, [projectId]);

  // ✅ 스크롤 항상 맨 아래로
  useEffect(() => {
    if (commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, loading]);

  // ✅ 외부 클릭 시 옵션 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        activeOption &&
        optionRef.current &&
        !optionRef.current.contains(e.target)
      ) {
        setActiveOption(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeOption]);

  // ✅ 우클릭 메뉴
  const handleRightClick = (e, id, isUser) => {
    if (!isUser) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveOption({ id, x: e.clientX, y: e.clientY });
  };

  // ✅ 파일 업로드
  const handleFileUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // ✅ 코멘트 작성 (Mentions Enter 전송에서도 호출됨)
  const handleSubmit = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 텍스트가 비어있고 파일도 없으면 전송 금지
    const hasText = !!newComment.trim();
    const hasFile = !!selectedFile;
    if ((!hasText && !hasFile) || isSubmitting) return;

    const createdAt = new Date().toISOString();
    const uid = String(
      currentUser?.userId ?? currentUser?.id ?? currentUser?.memberID ?? ""
    );

    const baseData = {
      projectId: String(projectId),
      userId: uid,
      createdAt,
    };

    try {
      setIsSubmitting(true);

      // 파일 메시지
      if (hasFile) {
        const fileData = {
          ...baseData,
          text: selectedFile.name,
          file: true,
        };
        const resFile = await fetch(`${API_BASE}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        });
        const savedFile = await resFile.json();
        setComments((prev) => [
          ...prev,
          {
            ...savedFile,
            createdAt: savedFile.createdAt || createdAt,
            text: String(savedFile.text ?? ""),
          },
        ]);
      }

      // 텍스트 메시지 (줄바꿈 포함 그대로 저장)
      if (hasText) {
        const textData = { ...baseData, text: newComment };
        const resText = await fetch(`${API_BASE}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(textData),
        });
        const savedText = await resText.json();
        setComments((prev) => [
          ...prev,
          {
            ...savedText,
            createdAt: savedText.createdAt || createdAt,
            text: String(savedText.text ?? ""),
          },
        ]);
      }

      setNewComment("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("코멘트 등록 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 코멘트 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`${API_BASE}/comments/${id}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== id));
      setActiveOption(null);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 파일 다운로드 (로컬 테스트용)
  const handleFileDownload = (fileName) => {
    const fileUrl = `/uploads/${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 날짜별 그룹화
  const groupedByDate = comments.reduce((acc, comment) => {
    const dateKey = getFormattedDate(comment.createdAt) || "날짜 없음";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(comment);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    const da = a === "날짜 없음" ? 0 : new Date(a.split(" ")[0]).getTime();
    const db = b === "날짜 없음" ? 0 : new Date(b.split(" ")[0]).getTime();
    return da - db;
  });

  if (loading) return <div></div>;

  return (
    <div className="CommentTask">
      <div className="comment-list">
        {sortedDates.length === 0 ? (
          <p className="no-txt">작성된 코멘트가 없습니다.</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <p className="date-indicator">{date}</p>

              {groupedByDate[date].map((msg, idx, arr) => {
                const prevMsg = arr[idx - 1];
                const nextMsg = arr[idx + 1];
                const isMine = String(msg.userId) === String(auth?.userId);

                // 이전/다음 메시지와 같은 사용자 + 같은 분 단위 시간 비교
                const sameSenderAsPrev =
                  prevMsg &&
                  prevMsg.userId === msg.userId &&
                  getFormattedTime(prevMsg.createdAt) ===
                    getFormattedTime(msg.createdAt);

                const sameSenderAsNext =
                  nextMsg &&
                  nextMsg.userId === msg.userId &&
                  getFormattedTime(nextMsg.createdAt) ===
                    getFormattedTime(msg.createdAt);

                return (
                  <div
                    key={msg.id}
                    className={`comment ${isMine ? "_us" : "_other"} ${
                      sameSenderAsPrev ? "continued" : ""
                    }`}
                  >
                    {/* 프로필: 같은 사람이 같은 분에 연속이면 생략 */}
                    {!sameSenderAsPrev && (
                      <div className="profile">
                        <img
                          src={
                            userMap[String(msg.userId)]?.userImage ||
                            "/images/default.png"
                          }
                          alt={userMap[String(msg.userId)]?.userName || ""}
                        />
                      </div>
                    )}

                    <div className="msg-box">
                      {/* 이름: 같은 사람이 같은 분에 연속이면 생략 */}
                      {!sameSenderAsPrev && (
                        <p className="user-name">
                          {userMap[String(msg.userId)]?.userName ||
                            "알 수 없음"}
                        </p>
                      )}

                      <div
                        className="msg"
                        onContextMenu={(e) =>
                          handleRightClick(e, msg.id, isMine)
                        }
                      >
                        {msg.file ? (
                          <p
                            className="txt _file"
                            onClick={() => handleFileDownload(msg.text)}
                          >
                            {msg.text}
                          </p>
                        ) : (
                          <p
                            className="txt"
                            dangerouslySetInnerHTML={{
                              __html: humanizeMentions(msg.text),
                            }}
                          />
                        )}

                        {/* 시간: 같은 분 내 마지막 메시지일 때만 표시 */}
                        {!sameSenderAsNext && (
                          <p className="time">
                            {getFormattedTime(msg.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 우클릭 옵션 UI를 쓰는 경우 여기서 activeOption 렌더링/삭제 버튼 연결하면 됨
                  handleDelete(activeOption.id) 같이 사용 */}
            </div>
          ))
        )}

        <div ref={commentEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="comment-input">
        <Mentions
          value={newComment}
          onChange={setNewComment}
          currentUser={currentUser}
          onSubmit={handleSubmit} // ✅ Enter 전송
        />

        <div className="control-box">
          <p className="file-name">{selectedFile ? selectedFile.name : ""}</p>
          <div>
            <button
              type="button"
              className="file-upload__btn"
              onClick={handleFileUploadClick}
            >
              파일 업로드
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="set-manager__btn"
              onClick={() => setAssignOpen(true)}
            >
              작업 위임
            </button>
            <button
              type="button"
              className="cmt-write__btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "" : "코멘트 작성"}
            </button>
          </div>
        </div>
      </div>

      {isAssignOpen && (
        <TeamSorting
          onClose={() => setAssignOpen(false)}
          projectTitle={projectTitle}
          brand={projectCompany}
          workNo={projectId}
          workTeam={workTeam}
          onSaveWorkTeam={onSaveWorkTeam}
        />
      )}
    </div>
  );
};

export default CommentTask;
