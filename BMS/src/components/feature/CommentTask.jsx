import "@components/feature/CommentTask.css";
import { useState, useEffect, useRef, useContext } from "react";
import { UserDataContext } from "../../App";

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
const getFormattedTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours > 12 ? "오후" : "오전"} ${hours % 12 || 12}:${minutes}`;
};

const CommentTask = ({ projectId, projectCompany }) => {
  const { userData, auth } = useContext(UserDataContext);
  const currentUser = userData.find((u) => u.id === auth.userId);

  const [comments, setComments] = useState([]);
  const [activeOption, setActiveOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const commentEndRef = useRef(null);
  const optionRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ 댓글 데이터 불러오기
  useEffect(() => {
    if (!projectId) return;
    fetch(`http://localhost:4000/comments?projectId=${Number(projectId)}`)
      .then((res) => res.json())
      .then((data) => {
        const withDate = data.map((c) => ({
          ...c,
          createdAt: c.createdAt || new Date().toISOString(),
          type: c.userId === auth.userId ? "_us" : "_other",
        }));
        setComments(withDate);
      })
      .catch((err) => console.error("코멘트 로드 실패:", err))
      .finally(() => setLoading(false));
  }, [projectId, auth.userId]);

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
  const handleFileUploadClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // ✅ 코멘트 작성
  const handleSubmit = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if ((!newComment.trim() && !selectedFile) || isSubmitting) return;

    const now = new Date();
    const time = getFormattedTime();
    const createdAt = now.toISOString();
 
    // 같은 회사면 "_us", 아니면 "_other"
    const type = currentUser.id === auth.userId ? "_us" : "_other";

    const baseData = {
      projectId: Number(projectId),
      userId: currentUser.id,
      type,
      name: currentUser.userName,
      time,
      createdAt,
    };

    try {
      setIsSubmitting(true);

      // 파일 메시지
      if (selectedFile) {
        const fileData = { ...baseData, text: selectedFile.name, file: true };
        const resFile = await fetch("http://localhost:4000/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        });
        const savedFile = await resFile.json();
        setComments((prev) => [...prev, savedFile]);
      }

      // 텍스트 메시지
      if (newComment.trim()) {
        const textData = { ...baseData, text: newComment.trim() };
        const resText = await fetch("http://localhost:4000/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(textData),
        });
        const savedText = await resText.json();
        setComments((prev) => [...prev, savedText]);
      }

      setNewComment("");
      setSelectedFile(null);
      fileInputRef.current.value = "";
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
      await fetch(`http://localhost:4000/comments/${id}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== id));
      setActiveOption(null);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 파일 다운로드 (로컬 테스트용. json에는 이름만 전달되고 있습니다.)
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
    const dateKey = getFormattedDate(comment.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(comment);
    return acc;
  }, {});
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a.split(" ")[0]) - new Date(b.split(" ")[0])
  );

  // ✅ 우클릭 메뉴 렌더링 (마우스 근처)
  /*const renderCommentOption = () => {
    if (!activeOption) return null;
    const { id, x, y } = activeOption;
    const comment = comments.find((c) => c.id === id);
    if (!comment || comment.type !== "_us") return null;

    const offsetX = 10;
    const offsetY = 10;
    const adjustedX =
      x + 160 > window.innerWidth ? window.innerWidth - 170 : x + offsetX;
    const adjustedY =
      y + 100 > window.innerHeight ? window.innerHeight - 110 : y + offsetY;

    return (
      <div
        ref={optionRef}
        className="comment-option floating"
        style={{
          position: "fixed",
          top: `${adjustedY}px`,
          left: `${adjustedX}px`,
          zIndex: 9999,
        }}
      >
        <button type="button">SMS 알림 보내기</button>
        <button type="button" onClick={() => handleDelete(id)}>
          삭제
        </button>
      </div>
    );
  };*/

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

                // 이전 메시지와 같은 사람 + 같은 시간(분 단위)인지 체크
                const sameSenderAsPrev =
                  prevMsg &&
                  prevMsg.userId === msg.userId &&
                  prevMsg.time.slice(0, 8) === msg.time.slice(0, 8);

                // 다음 메시지와 같은 사람 + 같은 시간(분 단위)인지 체크
                const sameSenderAsNext =
                  nextMsg &&
                  nextMsg.userId === msg.userId &&
                  nextMsg.time.slice(0, 8) === msg.time.slice(0, 8);

                return (
                  <div key={msg.id} className={`comment ${msg.type} ${sameSenderAsPrev ? "continued" : ""}`}>
                    {/* 프로필: 같은 사람이 같은 분에 연속으로 보냈다면 생략 */}
                    {!sameSenderAsPrev && (
                      <div className="profile">
                        <img src={userData.find((u) => u.id === msg.userId)?.userImage || "/default.png"} alt="" />
                      </div>
                    )}

                    <div className="msg-box">
                      {/* 이름: 같은 사람이 같은 분에 연속으로 보냈다면 생략 */}
                      {!sameSenderAsPrev && <p className="user-name">{msg.name}</p>}

                      <div
                        className="msg"
                        onContextMenu={(e) =>
                          handleRightClick(e, msg.id, msg.type === "_us")
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
                          <p className="txt">{msg.text}</p>
                        )}

                        {/* 시간: 같은 분 내 마지막 메시지일 때만 표시 */}
                        {!sameSenderAsNext && <p className="time">{msg.time}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={commentEndRef} />
      </div>

      {/* floating 옵션창 */}
      {/* {renderCommentOption()} */}

      {/* 입력 영역 */}
      <div className="comment-input">
        <div>
          <textarea
            placeholder="내용을 입력하세요."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
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
    </div>
  );
};

export default CommentTask;
