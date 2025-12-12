// src/components/feature/ProjectItem.jsx
import React, { useState, useEffect, useContext } from "react";
import Select from "@components/common/Select";
import {
  STATUS_OPTIONS_STYLESHIP,
  STATUS_OPTIONS_CUSTOMER,
} from "@/utils/constants";
import { UserDataContext } from "@/App";

const ProjectItem = ({ project, onClick, onBrandClick, isSelected }) => {
  const { auth, userData } = useContext(UserDataContext);

  // 현재 로그인 사용자 (회사에 따라 상태 옵션 분기)
  const currentUser =
    (userData || []).find((u) => String(u.userId) === String(auth?.userId)) ||
    null;
  const isStyleship = currentUser?.userCompany === "STYLESHIP";

  // 🔹 상태값: workStatus 기준
  const [status, setStatus] = useState(project.workStatus || "receipt");

  useEffect(() => {
    setStatus(project.workStatus || "receipt");
  }, [project]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    // TODO: 상태 변경 API 연동(PATCH) 위치
  };

  // 🔹 등록일 (WorkList 기준: workRegdate만 사용)
  const createdDate = project.workRegdate || null;

  const isNew = (() => {
    if (!createdDate) return false;
    const created = new Date(createdDate);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return diff < oneDay;
  })();

  // 🔹 표시용 필드 매핑 (WorkList API 전용)
  const brand = project.projectName || project.projectCompany || "";
  const sort = project.workCategory || "";
  const title = project.workTitle || "";

  // workTeam: "\"SR\"" 이런 식으로 따옴표 들어올 수 있어서 제거
  const team = project.workTeam
    ? [String(project.workTeam).replace(/"/g, "")]
    : [];

  return (
    <div className={`ProjectItem ${isSelected ? "_selected" : ""}`}>
      {/* 등록일: MM-DD */}
      <p className="date">
        {createdDate
          ? (() => {
              const d = new Date(createdDate);
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              return `${month}-${day}`;
            })()
          : ""}
      </p>

      {/* 번호: workNo */}
      <p className="number">{project.workNo}</p>

      {/* 브랜드: projectName / projectCompany */}
      <p className="brand" onClick={onBrandClick}>
        {brand}
      </p>

      {/* 분류: workCategory */}
      <p className="type">{sort}</p>

      {/* 제목 + 팀 + 신규 표시 */}
      <p className="title" onClick={onClick}>
        {title}
        {team.map(
          (t, idx) =>
            t && (
              <span key={idx} className="tag">
                {t}
              </span>
            )
        )}
        <span className="tag">@</span>
        {isNew && <span className="tag new">N</span>}
      </p>

      {/* 상태 셀렉트 (workStatus 기반) */}
      <Select
        name="status"
        value={status}
        options={
          isStyleship ? STATUS_OPTIONS_STYLESHIP : STATUS_OPTIONS_CUSTOMER
        }
        onChange={handleStatusChange}
        className={`_status _${status}`}
      />
    </div>
  );
};

// 🔥 project 참조 & isSelected 같으면 리렌더 안 함
export default React.memo(ProjectItem, (prevProps, nextProps) => {
  return (
    prevProps.project === nextProps.project &&
    prevProps.isSelected === nextProps.isSelected
  );
});
