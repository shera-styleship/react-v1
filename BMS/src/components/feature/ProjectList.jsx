// src/components/feature/ProjectList.jsx
import "@components/feature/ProjectList.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProjectFilterBar from "@components/feature/ProjectFilterBar";
import ProjectItem from "@components/feature/ProjectItem";

const TOKEN_KEY = "bms_token";

// 번호 정렬 기준
const getSortKey = (p) => {
  if (typeof p.workNo === "number") return p.workNo;
  if (typeof p.projectNo === "number") return p.projectNo;
  return 0;
};

const ALL_COMPANY_VALUES = ["all", "전체 회사", "전체", "", null, undefined];
const ALL_BRAND_VALUES = ["all", "전체 브랜드", "전체", "", null, undefined];

const ProjectList = ({ projects, onSelect, companyOptions }) => {
  const { projectNo } = useParams();

  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    company: "all",
    brand: "all",
    team: "",
    keyword: "",
    status: "active",
    startDate: "",
    endDate: "",
  });

  const [filteredProjects, setFilteredProjects] = useState(projects || []);

  const [brandOptions, setBrandOptions] = useState([
    { value: "all", label: "전체 브랜드" },
  ]);

  // 🔥 리스트에서 클릭된 줄(Work)의 번호만 따로 저장
  const [selectedWorkNo, setSelectedWorkNo] = useState(null);

  // projects가 바뀌었는데 이전에 선택한 workNo가 사라졌으면 선택 해제
  useEffect(() => {
    if (!selectedWorkNo) return;
    const exists = Array.isArray(projects)
      ? projects.some((p) => p.workNo === selectedWorkNo)
      : false;
    if (!exists) {
      setSelectedWorkNo(null);
    }
  }, [projects, selectedWorkNo]);

  // ✅ URL로 들어온 경우(/project/:projectNo)에도 하이라이트 맞추기
  useEffect(() => {
    if (!projectNo || !Array.isArray(projects)) return;

    const target = projects.find(
      (p) => String(p.workNo ?? p.projectNo) === String(projectNo)
    );
    if (target && target.workNo != null) {
      setSelectedWorkNo(target.workNo);
    }
  }, [projectNo, projects]);

  // ─────────────────────────────
  // 회사별 브랜드 목록 로딩
  // ─────────────────────────────
  const fetchBrands = async (companyValue) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      let params = {};

      const isAllCompany = ALL_COMPANY_VALUES.includes(companyValue);
      if (!isAllCompany) {
        const company = companyOptions.find((c) => c.value === companyValue);
        if (company?.companyNo) {
          params.clientCompanyNo = company.companyNo;
        }
      }

      const res = await axios.get(
        "https://bmsapi.styleship.com/api/Common/brands",
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
          params,
        }
      );

      const apiBrands = res.data || [];
      const options = [
        { value: "all", label: "전체 브랜드" },
        ...apiBrands.map((b) => ({
          value: b.brandName || b.projectName,
          label: b.brandName || b.projectName,
        })),
      ];
      setBrandOptions(options);
    } catch (err) {
      console.error("브랜드 목록 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchBrands(filters.company);
  }, [filters.company, companyOptions]);

  // ─────────────────────────────
  // 검색/필터 실제 적용 로직
  // ─────────────────────────────
  const applyFilter = (f) => {
    if (!Array.isArray(projects)) {
      setFilteredProjects([]);
      return;
    }

    let result = [...projects];

    // 회사 필터
    if (!ALL_COMPANY_VALUES.includes(f.company)) {
      result = result.filter((p) => p.projectCompany === f.company);
    }

    // 브랜드 필터
    if (!ALL_BRAND_VALUES.includes(f.brand)) {
      result = result.filter((p) => p.projectName === f.brand);
    }

    // 팀 필터
    if (f.team && f.team !== "all") {
      const target = f.team.toLowerCase();
      result = result.filter((p) => {
        if (!p.workTeam) return false;
        const normalized = String(p.workTeam).replace(/"/g, "").toLowerCase();
        return normalized === target;
      });
    }

    // 검색어 필터
    if (f.keyword && f.keyword.trim() !== "") {
      const kw = f.keyword.toLowerCase();
      result = result.filter((p) => {
        const title = p.workTitle || p.projectTitle || "";
        const writer = p.writer || "";
        return (
          title.toLowerCase().includes(kw) || writer.toLowerCase().includes(kw)
        );
      });
    }

    // 날짜 필터
    if (f.startDate && f.endDate) {
      const start = new Date(f.startDate);
      const end = new Date(f.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((p) => {
        const dateStr =
          p.workRegdate || p.projectDate || p.regDate || p.createdAt;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d >= start && d <= end;
      });
    }

    // 정렬
    result.sort((a, b) => getSortKey(b) - getSortKey(a));
    setFilteredProjects(result);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    applyFilter(newFilters);
  };

  const handleSearchButton = () => {
    const updated = { ...filters, keyword: searchInput };
    setFilters(updated);
    applyFilter(updated);
  };

  const handleBrandClick = (brandName) => {
    const updated = { ...filters, brand: brandName };
    setFilters(updated);
    applyFilter(updated);
  };

  return (
    <div className="ProjectList">
      <ProjectFilterBar
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilter}
        companyOptions={companyOptions}
        brandOptions={brandOptions}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearchButton}
      />

      <div className="item-list-bar">
        <p className="date">등록일</p>
        <p className="number">번호</p>
        <p className="brand">브랜드</p>
        <p className="type">분류</p>
        <p className="title">제목</p>
        <p className="status">상태</p>
      </div>

      <div className="item__list">
        {filteredProjects.length === 0 && (
          <p className="no-txt">조건에 맞는 프로젝트가 없습니다.</p>
        )}

        {filteredProjects.map((p, idx) => (
          <ProjectItem
            key={p.workNo ?? p.projectNo ?? `row-${idx}`}
            project={p}
            onClick={() => {
              setSelectedWorkNo(p.workNo ?? null);
              onSelect(p);
            }}
            onBrandClick={() => handleBrandClick(p.projectName)}
            isSelected={selectedWorkNo != null && p.workNo === selectedWorkNo}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
