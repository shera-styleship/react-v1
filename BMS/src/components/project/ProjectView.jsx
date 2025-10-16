import { useState, useRef, useEffect } from "react";
import Select from "../form/Select";
import CommentTask from "./CommentTask";
import FileTask from "./FileTask";
import TimeTask from "./TimeTask";

const ProjectView = ()=>{
    const [status, setStatus] = useState("receipt");
    const [activeTab, setActiveTab] = useState('comment');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [isDetailVisible, setIsDetailVisible] = useState(true);

    const controlRef = useRef(null);

    const statusOptions = [
        { value: "receipt", label: "접수" },
        { value: "progress", label: "진행" },
        { value: "hold", label: "보류요청" },
        { value: "completion", label: "완료요청" },
        { value: "cancel", label: "취소" }
    ];

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };  
    
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleExpand = () => {
        setIsDetailVisible((prev) => !prev); 
    };

    useEffect(() => {
        const container = controlRef.current;
        const activeBtn = container?.querySelector(`.control__btn.on`);
        if (activeBtn) {
            const span = activeBtn.querySelector("span");
            setIndicatorStyle({
                left: activeBtn.offsetLeft + 16,
                width: span.offsetWidth,
            });
        }
    }, [activeTab]);

    return (
        <div className="ProjectView">
            {/* <p className="no-txt">목록에서 프로젝트를 선택하세요.</p> */}

            <div className="project-info">
                <div className="hd">
                    <div>
                        <p className="number">84737</p>
                        <p className="brand">NPLUS(네파)</p>
                    </div>
                    <div>
                        <button type="button" className="url__btn">url 복사</button>

                        <Select 
                            name="status"
                            value={status}
                            options={statusOptions}
                            onChange={handleStatusChange}
                            className={`_status _${status}`}
                        />
                    </div>
                </div>

                <p className="title">○ [키즈] WINTER VACANCE 다운 프리오더 (8/13~9/21)</p>

                <div className="bt">
                    <div>
                        <dl>
                            <dt>작성자</dt>
                            <dd>임꺽정</dd>
                        </dl>
                    </div>
                    <div>
                        <dl>
                            <dt>등록일</dt>
                            <dd>2025-08-06 오후 1:20:47</dd>
                        </dl>
                        <dl>
                            <dt>마감일</dt>
                            <dd>2025-08-26</dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className={`project-detail ${!isDetailVisible ? "_close" : ""}`}>
                <div className="con">

                    <p>
                        안녕하세요, 라이카 카메라 코리아 기획전 제작 요청드립니다.<br/>
                        https://filahds-my.sharepoint.com/:x:/g/personal/anji09_~~~~~~~~~~<br/>
                        오픈 8/26<br />
                        확인 부탁드립니다.
                    </p>
                </div>
            </div>

            <div className="project-control" ref={controlRef}>
                <button type="button" className={`control__btn ${activeTab === 'comment' ? 'on' : ''}`} onClick={() => handleTabClick("comment")}>
                    <span>코멘트</span>
                </button>
                <button type="button" className={`control__btn ${activeTab === 'file' ? 'on' : ''}`} onClick={() => handleTabClick("file")}>
                    <span>파일 모아보기</span>
                </button>
                <button type="button" className={`control__btn ${activeTab === 'time' ? 'on' : ''}`} onClick={() => handleTabClick("time")}>
                    <span>작업시간</span>
                </button>

                <button type="button" className="expand__btn" onClick={handleExpand}></button>
                <div 
                    className="indicator-bar"
                    style={{
                        left: `${indicatorStyle.left}px`,
                        width: `${indicatorStyle.width}px`
                    }}
                ></div>
            </div>

            <div className="project-task">
                {activeTab === "comment" && <CommentTask />}
                {activeTab === "file" && <FileTask />}
                {activeTab === "time" && <TimeTask />}
            </div>
        </div>
    )
}

export default ProjectView;      