import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/common/Button";
import Select from "@components/common/Select";
import Input from "@components/common/Input";
import { UserDataContext } from "@/App";
import "./NewProject.css";
import { API_BASE } from "@/utils/env";

const TOKEN_KEY = "bms_token";
const REAL_API = "https://bmsapi.styleship.com";

// Styleship 회사 번호(네가 준 값)
const STYLESHIP_COMPANY_NO = 14;
// Styleship 브랜드 번호(네가 준 값)
const STYLESHIP_BRAND_NO = 14;

const NewProject = ({ alertType = true, onClose }) => {
  const { userData, auth, refreshProjects } = useContext(UserDataContext);
  const nav = useNavigate();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openAlert = (msg) => {
    setErrorMsg(msg);
    setIsAlertOpen(true);
  };
  const closeAlert = () => setIsAlertOpen(false);

  const [form, setForm] = useState({
    company: "",
    companyNo: "",
    brand: "",
    brandNo: "",
    writer: "",
    title: "",
    endDate: "",
    type: "",
    description: "",
  });

  const [companies, setCompanies] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingCommon, setLoadingCommon] = useState(false);

  // 토큰/헤더 메모
  const headersRef = useRef(null);
  const buildHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // localStorage(bms_member) 파싱
  const storedMember = useMemo(() => {
    try {
      const raw = localStorage.getItem("bms_member");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("bms_member 파싱 오류", e);
      return null;
    }
  }, []);

  // 로그인 유저 찾기(직원 계정은 userData에서 매칭되는 경우가 많음)
  const loginUser = useMemo(() => {
    const uid = String(auth?.userId ?? "");
    if (!uid) return null;

    return (
      (userData || []).find((u) => String(u.id) === uid) ||
      (userData || []).find((u) => String(u.userId) === uid) ||
      null
    );
  }, [userData, auth?.userId]);

  // 작성자명: bms_member 우선 -> loginUser fallback
  const writerName = useMemo(() => {
    const n1 =
      storedMember?.memberName ||
      storedMember?.userName ||
      storedMember?.name ||
      "";
    if (n1) return String(n1);

    const n2 =
      loginUser?.userName ||
      loginUser?.memberName ||
      loginUser?.name ||
      loginUser?.userIdName ||
      "";
    return n2 ? String(n2) : "";
  }, [storedMember, loginUser]);

  // 작성자 자동 세팅
  useEffect(() => {
    if (!writerName) return;
    setForm((prev) => ({ ...prev, writer: writerName }));
  }, [writerName]);

  // 어드민 판정
  const isAdminLike = useMemo(() => {
    const loginCompany = String(loginUser?.userCompany || "").toLowerCase();
    const storedCompany = String(storedMember?.userCompany || "").toLowerCase();

    const storedCompanyNo =
      storedMember?.clientCompanyNo ??
      storedMember?.companyNo ??
      storedMember?.userCompanyNo ??
      null;

    const memberType = Number(
      storedMember?.memberType ?? loginUser?.memberType ?? 0
    );

    const byNo =
      storedCompanyNo != null &&
      String(storedCompanyNo) === String(STYLESHIP_COMPANY_NO);

    const byName =
      loginCompany === "styleship" || storedCompany === "styleship";

    const byType = memberType === 1; // 네 규칙: 1 = 스타일쉽 직원

    return byNo || byName || byType;
  }, [loginUser, storedMember]);

  // 공통: companies 로드 (최초 1회)
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCommon(true);
      try {
        const headers = buildHeaders();
        headersRef.current = headers;

        const cRes = await fetch(`${REAL_API}/api/Common/companies`, {
          headers,
        });
        if (!cRes.ok) throw new Error(`companies 실패 (${cRes.status})`);

        const cData = await cRes.json();
        setCompanies(Array.isArray(cData) ? cData : []);
      } catch (err) {
        console.error("Companies API 오류:", err);
        setCompanies([]);
      } finally {
        setLoadingCommon(false);
      }
    };

    fetchCompanies();
  }, []);

  // companyOptions
  const companyOptionsAll = useMemo(() => {
    return (companies || [])
      .map((c) => ({
        value: String(c.clientCompanyName ?? ""),
        label: String(c.clientCompanyName ?? ""),
        companyNo: c.clientCompanyNo,
      }))
      .filter((o) => o.value);
  }, [companies]);

  // 비어버리는 문제 방지: "일반 유저" 회사 필터도 문자열 말고 companyNo 우선
  const companyOptions = useMemo(() => {
    if (isAdminLike) return companyOptionsAll;

    const myCompanyName = String(
      loginUser?.userCompany || storedMember?.userCompany || ""
    ).trim();

    const myCompanyNo =
      storedMember?.clientCompanyNo ??
      storedMember?.companyNo ??
      storedMember?.userCompanyNo ??
      null;

    if (myCompanyNo != null) {
      const filtered = companyOptionsAll.filter(
        (opt) => String(opt.companyNo) === String(myCompanyNo)
      );
      if (filtered.length > 0) return filtered;
    }

    if (myCompanyName) {
      const filtered = companyOptionsAll.filter(
        (opt) =>
          String(opt.value || "").toLowerCase() === myCompanyName.toLowerCase()
      );
      if (filtered.length > 0) return filtered;
    }

    return companyOptionsAll;
  }, [companyOptionsAll, isAdminLike, loginUser, storedMember]);

  // 회사 기본값 세팅: 어드민이면 무조건 companyNo 14를 우선
  useEffect(() => {
    if (companyOptions.length === 0) return;

    let picked = companyOptions[0];

    if (isAdminLike) {
      const styleship = companyOptionsAll.find(
        (o) => String(o.companyNo) === String(STYLESHIP_COMPANY_NO)
      );
      if (styleship) picked = styleship;
    }

    setForm((prev) => {
      if (!isAdminLike && prev.company) return prev;

      if (
        isAdminLike &&
        String(prev.companyNo) === String(STYLESHIP_COMPANY_NO)
      ) {
        return prev;
      }

      return {
        ...prev,
        company: picked.value,
        companyNo: picked.companyNo ? String(picked.companyNo) : "",
        brand: "",
        brandNo: "",
      };
    });
  }, [companyOptions, companyOptionsAll, isAdminLike]);

  // =========================
  // 브랜드 강제 표시 핵심 수정
  // =========================

  // 어떤 형태로 오든 배열만 최대한 뽑아내기
  const normalizeBrands = (json) => {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.result)) return json.result;
    if (Array.isArray(json?.items)) return json.items;
    return [];
  };

  // brands를 "회사에 종속"으로 가져오기 (하지만 실패/필터불가면 전체라도 보여주기)
  const fetchBrandsByCompany = async (companyNo) => {
    if (!companyNo) {
      setBrands([]);
      return;
    }

    const headers = headersRef.current || buildHeaders();
    setLoadingCommon(true);

    try {
      const urlsToTry = [
        `${REAL_API}/api/Common/brands?clientCompanyNo=${encodeURIComponent(
          companyNo
        )}`,
        `${REAL_API}/api/Common/brands?companyNo=${encodeURIComponent(
          companyNo
        )}`,
        `${REAL_API}/api/Common/brands`,
      ];

      let raw = [];

      for (const url of urlsToTry) {
        const res = await fetch(url, { headers });
        if (!res.ok) continue;

        const json = await res.json();
        const arr = normalizeBrands(json);

        // 일단 확보
        raw = arr;

        // 쿼리 붙인 요청이면서 뭔가 내려오면 우선 성공으로 간주
        if (url.includes("?") && arr.length > 0) break;
      }

      // 여기서 raw가 비었으면: 어떤 이유든 brands 못 가져온 것
      // -> UX 깨지니까 빈 배열로만 두지 말고, 한번 더 /brands 재시도(안정장치)
      if (!Array.isArray(raw) || raw.length === 0) {
        const fallbackRes = await fetch(`${REAL_API}/api/Common/brands`, {
          headers,
        });
        if (fallbackRes.ok) {
          const fallbackJson = await fallbackRes.json();
          raw = normalizeBrands(fallbackJson);
        }
      }

      // 회사 매칭 필드가 있으면 필터링
      // 없으면(현재 너 샘플 케이스) 필터링 불가 -> raw 그대로 전체 노출
      const hasCompanyKey = raw.some(
        (b) => b?.clientCompanyNo != null || b?.companyNo != null
      );

      const filtered = hasCompanyKey
        ? raw.filter((b) => {
            const a =
              b?.clientCompanyNo != null ? String(b.clientCompanyNo) : null;
            const c = b?.companyNo != null ? String(b.companyNo) : null;
            return a === String(companyNo) || c === String(companyNo);
          })
        : raw;

      // 그래도 필터 결과가 비면(회사키는 있는데 해당 회사가 0개) -> raw를 보여주기 (강제 표시)
      setBrands(filtered.length > 0 ? filtered : raw);
    } catch (err) {
      console.error("Brands API 오류:", err);
      setBrands([]);
    } finally {
      setLoadingCommon(false);
    }
  };

  useEffect(() => {
    if (!form.companyNo) return;
    fetchBrandsByCompany(form.companyNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.companyNo]);

  // brandOptions (키가 projectName이 아닐 수도 있으니 최대한 대응)
  const brandOptions = useMemo(() => {
    return (brands || [])
      .map((b) => {
        const name =
          b?.projectName ?? b?.brandName ?? b?.name ?? b?.title ?? "";

        const no = b?.projectNo ?? b?.brandNo ?? b?.id ?? "";

        return {
          value: String(name ?? ""),
          label: String(name ?? ""),
          brandNo: no,
        };
      })
      .filter((o) => o.value);
  }, [brands]);

  // 브랜드 기본값 세팅
  // - 회사가 Styleship(14)면 브랜드도 Styleship(14)를 "강제"로 우선 선택
  // - 그 외엔 기존처럼 첫 번째
  useEffect(() => {
    if (brandOptions.length === 0) {
      setForm((prev) => ({ ...prev, brand: "", brandNo: "" }));
      return;
    }

    const companyNo = String(form.companyNo || "");

    // Styleship이면 브랜드 14를 우선
    if (companyNo === String(STYLESHIP_COMPANY_NO)) {
      const styleshipBrand =
        brandOptions.find(
          (o) => String(o.brandNo) === String(STYLESHIP_BRAND_NO)
        ) || brandOptions.find((o) => o.value.toLowerCase() === "styleship");

      if (styleshipBrand) {
        setForm((prev) => ({
          ...prev,
          brand: styleshipBrand.value,
          brandNo: styleshipBrand.brandNo ? String(styleshipBrand.brandNo) : "",
        }));
        return;
      }
    }

    // 기존 선택이 목록에 있으면 유지
    const exists = brandOptions.some((o) => o.value === form.brand);
    if (exists) return;

    // 없으면 첫 번째로 세팅
    const first = brandOptions[0];
    setForm((prev) => ({
      ...prev,
      brand: first.value,
      brandNo: first.brandNo ? String(first.brandNo) : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandOptions, form.companyNo]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      const picked = companyOptionsAll.find((o) => o.value === value);

      setForm((prev) => ({
        ...prev,
        company: value,
        companyNo: picked?.companyNo ? String(picked.companyNo) : "",
        brand: "",
        brandNo: "",
      }));
      return;
    }

    if (name === "brand") {
      const picked = brandOptions.find((o) => o.value === value);
      setForm((prev) => ({
        ...prev,
        brand: value,
        brandNo: picked?.brandNo ? String(picked.brandNo) : "",
      }));
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getNextProjectNo = async () => {
    try {
      const res = await fetch(`${API_BASE}/projectList`);
      const data = await res.json();
      if (data.length === 0) return 10001;
      const maxNo = Math.max(...data.map((p) => Number(p.projectNo)));
      return maxNo + 1;
    } catch {
      return Math.floor(Math.random() * 90000) + 10000;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "기한 없음";
    const date = new Date(dateStr);
    if (isNaN(date)) return "기한 없음";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (loadingCommon)
      return openAlert("회사/브랜드 정보를 불러오는 중입니다.");
    if (!form.company) return openAlert("회사를 선택하세요.");
    if (!form.brand) return openAlert("브랜드를 선택하세요.");

    if (!form.title.trim()) return openAlert("프로젝트 제목을 입력하세요.");
    if (form.title.length > 30)
      return openAlert("제목은 30자까지 입력할 수 있습니다.");
    if (!form.type) return openAlert("작업 종류를 선택하세요.");
    if (!form.description.trim())
      return openAlert("프로젝트 내용을 입력하세요.");
    if (form.description.length > 500)
      return openAlert("내용은 500자까지 입력할 수 있습니다.");

    try {
      const nextNo = await getNextProjectNo();

      const newProject = {
        id: String(Date.now()),
        projectNo: nextNo,
        projectDate: new Date().toISOString(),
        projectStatus: "receipt",
        projectTeam: [],
        projectManager: auth?.userId ? [auth.userId] : [],
        writer: form.writer || "",
        projectCompany: form.company,
        projectBrand: form.brand,
        projectSort: form.type,
        projectTitle: form.title,
        projectContent: form.description,
        projectDeadline: form.endDate,

        clientCompanyNo: form.companyNo,
        projectNoFromCommon: form.brandNo,
      };

      const res = await fetch(`${API_BASE}/projectList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) throw new Error("등록 실패");

      refreshProjects();
      onClose();

      setTimeout(() => {
        nav(`/project/${newProject.projectNo}`);
      }, 200);
    } catch (err) {
      console.error("프로젝트 등록 오류:", err);
      openAlert("등록 실패. 콘솔을 확인하세요.");
    }
  };

  return (
    <>
      <div className="alert_modal _project on">
        <div className="alert_wrap on">
          <div className="alert_box">
            <div className="alert_title">프로젝트 생성</div>

            <div className="new-box">
              <div className="select-box">
                <div>
                  <p className="txt">회사</p>
                  <Select
                    name="company"
                    value={form.company}
                    options={
                      companyOptions.length > 0
                        ? companyOptions
                        : [
                            {
                              value: "",
                              label: loadingCommon
                                ? "불러오는 중..."
                                : "회사 정보 없음",
                            },
                          ]
                    }
                    onChange={handleSelectChange}
                    disabled={!isAdminLike}
                    className={!isAdminLike ? "disabled" : ""}
                  />
                </div>

                <div>
                  <p className="txt">브랜드</p>
                  <Select
                    name="brand"
                    value={form.brand}
                    options={
                      brandOptions.length > 0
                        ? brandOptions
                        : [
                            {
                              value: "",
                              label: loadingCommon
                                ? "불러오는 중..."
                                : "브랜드 정보 없음",
                            },
                          ]
                    }
                    onChange={handleSelectChange}
                    disabled={brandOptions.length === 0 || loadingCommon}
                  />
                </div>

                <div>
                  <p className="txt">작성자</p>
                  <Input
                    inputType="text"
                    inputValue={form.writer}
                    setValue={(val) =>
                      setForm((prev) => ({ ...prev, writer: val }))
                    }
                    inputAble={false}
                  />
                </div>
              </div>

              <div className="select-box">
                <div className="_title">
                  <p className="txt">
                    프로젝트 제목 <span>*</span>
                  </p>
                  <Input
                    inputType="text"
                    inputValue={form.title}
                    setValue={(val) =>
                      setForm((prev) => ({ ...prev, title: val }))
                    }
                    inputPlaceholder={"프로젝트 제목을 입력하세요"}
                  />
                  <span className="limit-txt"> {form.title.length}/30자</span>
                </div>

                <div className="_deadline">
                  <p className="txt">마감일</p>
                  <div>
                    <p className="date">{formatDate(form.endDate)}</p>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="select-box">
                <div className="_type">
                  <p className="txt">
                    작업 종류 <span>*</span>
                  </p>
                  <div>
                    {[
                      "프로모션",
                      "기획전",
                      "이벤트",
                      "외부몰",
                      "오류 수정",
                      "기능 수정/추가",
                    ].map((type, idx) => {
                      const id = `type_${idx + 1}`;
                      return (
                        <div className="chk" key={id}>
                          <input
                            id={id}
                            type="radio"
                            name="type"
                            value={type}
                            checked={form.type === type}
                            onChange={handleChange}
                            className="rd__style1"
                          />
                          <label htmlFor={id}>{type}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="select-box">
                <div className="_content">
                  <p className="txt">
                    프로젝트 내용 <span>*</span>
                  </p>
                  <div>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="작업 내용을 입력하세요"
                    />
                    <span className="limit-txt">
                      {form.description.length}/500자
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="notice-box">
              <ul>
                <li>
                  작업일정 : 자료 접수후 5일 (영업일 기준, 주말 및 공휴일 제외)
                </li>
                <li>기타 일정시 담당자와 꼭 협의해 주시기 바랍니다.</li>
                <li>
                  페이지 수정 및 변경을 요청시에는 첨부양식 사용바랍니다.{" "}
                  <a href="">양식다운받기</a>
                </li>
              </ul>
            </div>

            <div className="alert_btn">
              <Button onClick={handleSubmit} btnSize="small" btnChar="orange">
                등록
              </Button>

              {alertType && (
                <Button onClick={onClose} btnSize="small" btnChar="white">
                  취소
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAlertOpen && (
        <div className="alert_modal on">
          <div className="alert_wrap on">
            <div className="alert_box">
              <div className="alert_title">프로젝트 생성</div>
              <div className="alert_txt">{errorMsg}</div>
              <div className="alert_btn">
                <Button onClick={closeAlert} btnSize="small" btnChar="orange">
                  확인
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewProject;
