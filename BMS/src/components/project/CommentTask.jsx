import { useState, useEffect } from "react";

const CommentTask = ()=>{
    const [activeOption, setActiveOption] = useState(null);

    // 다른 곳 클릭 시 옵션 닫기
    useEffect(() => {
        const handleClickOutside = () => setActiveOption(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleRightClick = (e, commentIndex, messageIndex, isUser) => {
        if (!isUser) return;
        e.preventDefault();
        e.stopPropagation();
        setActiveOption({ commentIndex, messageIndex });
    };

     const comments = [
        {
            id: 1,
            type: "_us",
            name: "홍길동",
            profile: "/images/profile01.jpg",
            messages: [
                { text: "250818_수정사항.jpg", file: true },
                {
                    text: "텍스트 및 이미지 변경이 있어 요청사항 전달드렸습니다. 수정사항 확인 부탁드립니다.",
                    time: "오후 4:43",
                },
            ],
        },
        {
            id: 2,
            type: "_other",
            name: "장길산",
            profile: "/images/profile02.jpg",
            messages: [
                { text: "250818_수정사항.jpg", file: true },
                {
                    text: "텍스트 및 이미지 변경이 있어 요청사항 전달드렸습니다. 수정사항 확인 부탁드립니다.",
                    time: "오후 4:43",
                },
            ],
        },
        {
            id: 3,
            type: "_us",
            name: "임꺽정",
            profile: "/images/profile03.jpg",
            messages: [
                {
                    text: "확인했습니다. 진행하겠습니다.",
                    time: "오후 4:43",
                },
            ],
        },
    ];

    return (
        <div className="CommentTask">
            <div className="comment-list">
                {/* <p className="no-txt">작성된 코멘트가 없습니다.</p> */}
                <div>
                    <p className="date-indicator">2025-10-15 수요일</p>

                    {comments.map((cmt, i) => (
                        <div
                            key={cmt.id}
                            className={`comment ${cmt.type}`}
                        >
                            <div className="profile">
                                <img src={cmt.profile} alt="" />
                            </div>
                            <div className="msg-box">
                                <p className="user-name">{cmt.name}</p>
                                {cmt.messages.map((msg, j) => (
                                    <div
                                        className="msg"
                                        key={j}
                                        onContextMenu={(e) => handleRightClick(e, i, j, cmt.type === "_us")}
                                    >
                                        <p className={`txt ${msg.file ? "_file" : ""}`}>{msg.text}</p>
                                        {msg.time && <p className="time">{msg.time}</p>}

                                        {activeOption &&
                                            activeOption.commentIndex === i &&
                                            activeOption.messageIndex === j &&
                                            cmt.type === "_us" && (
                                                <div className="comment-option">
                                                    <button type="button">SMS 알림 보내기</button>
                                                    <button type="button">삭제</button>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="comment-input">
                <div>
                    <textarea name="" id="" placeholder="내용을 입력하세요."></textarea>
                </div>
                <div className="control-box">
                    <p className="file-name">250818_수정시안.zip</p>
                    <div>
                        <button type="button" className="file-upload__btn">파일 업로드</button>
                        <button type="button" className="set-manager__btn">작업 위임</button>
                        <button type="button" className="cmt-write__btn">코멘트 작성</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default CommentTask;