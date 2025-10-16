import ProjectFilterBar from "./ProjectFilterBar";
import ProjectItem from "./ProjectItem";

const ProjectList = ()=>{
    return (
        <div className="ProjectList">
            <ProjectFilterBar />

            <div className="item-list-bar">
                <p className="date">등록일</p>
                <p className="number">번호</p>
                <p className="brand">브랜드</p>
                <p className="type">분류</p>
                <p className="title">제목</p>
                <p className="status">상태</p>
            </div>

            <div className="item__list">
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
            </div>
        </div>
    )
}

export default ProjectList;      