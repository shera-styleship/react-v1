import Select from "@components/common/Select";
import { useState, useEffect, useContext } from "react";
import { STATUS_OPTIONS_STYLESHIP, STATUS_OPTIONS_CUSTOMER  } from "@/utils/constants";
import { UserDataContext } from "@/App";

const ProjectItem = ({ project, onClick, onBrandClick, isSelected }) => {
  const [status, setStatus] = useState("receipt");
  const { auth, userData } = useContext(UserDataContext);
  const currentUser = userData.find((u) => u.userId === auth.userId);
  const isStyleship = currentUser?.userCompany === "STYLESHIP"; 
  

  useEffect(() => {
    setStatus(project.projectStatus || "receipt");
  }, [project]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // ✅ 선택 시 DB에 반영하고 싶다면 여기에 fetch/axios로 PATCH 요청 추가 가능
    // fetch(`http://localhost:4000/projectList/${project.id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ projectStatus: newStatus }),
    // });
  };

  const isNew = (() => {
    if (!project.projectDate) return false;
    const created = new Date(project.projectDate);
    const now = new Date();
    const diff = now - created; // 밀리초 단위
    const oneDay = 24 * 60 * 60 * 1000; // 1일
    return diff < oneDay;
  })();

  return (
    <div className={`ProjectItem ${isSelected ? "_selected" : ""}`}>
      <p className="date">
        {project.projectDate
          ? (() => {
              const d = new Date(project.projectDate);
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              return `${month}-${day}`;
            })()
          : ""}
      </p>
      <p className="number">{project.projectNo}</p>
      <p className="brand" onClick={onBrandClick}>
        {project.projectBrand}
      </p>
      <p className="type">{project.projectSort}</p>
      <p className="title" onClick={onClick}>
        {project.projectTitle}
        <span className="tag">{project.projectTeam}</span>
        <span className="tag">@</span> 
        {isNew && <span className="tag new">N</span>}
      </p>
      <Select
        name="status"
        value={status}
        options={isStyleship ? STATUS_OPTIONS_STYLESHIP : STATUS_OPTIONS_CUSTOMER}
        onChange={handleStatusChange}
        className={`_status _${status}`}
      />
    </div>
  );
};

export default ProjectItem;
