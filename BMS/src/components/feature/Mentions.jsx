import "@components/feature/Mentions.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { API_BASE } from "@/utils/env";

const Mentions = ( {value, onChange, currentUser } ) => {
  // 입력값(react-mentions가 관리하는 텍스트 전체)
  //const [value, setValue] = useState("");
  // 위에서 받아오는 것으로 변경. 

  // 서버에서 불러온 원본 사용자 목록
  const [userData, setUserData] = useState([]);
  // 제안 목록을 별도 DOM에 포털로 렌더링하기 위한 ref
  // - 부모 요소의 overflow / z-index 영향을 줄이기 위해 사용
  const portalRef = useRef(null);

  // ★ 데모용 현재 사용자 (실전에서는 로그인 컨텍스트/전역에서 주입)
  /*const currentUser = {
    id: "99",
    userName: "관리자",
    userCompany: "STYLESHIP", // STYLESHIP, NPLUS(네파), 미스토코리아(주)
    role: "ADMIN", // ADMIN: 모두, USER: 같은 회사만
  };*/

  // 1) 사용자 목록 불러오기
  //    API가 배열 또는 { userInfo: [...] } 두 형태를 지원한다고 가정하고 안전 파싱
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/userInfo`);
        if (!res.ok) throw new Error("Failed to load users");
        const list = await res.json();
        // API 응답이 배열이거나 { userInfo: [...] } 일 수 있으므로 두 경우를 커버
        const arr = Array.isArray(list)
          ? list
          : Array.isArray(list?.userInfo)
          ? list.userInfo
          : [];
        setUserData(arr);
      } catch (e) {
        console.error(e);
        setUserData([]); // 실패 시 빈 배열로 초기화
      }
    })();
  }, []);

  // 회사명을 비교용으로 정규화(공백 제거/소문자화 등)
  const normalizeCompany = (c) =>
    String(c ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      // 별칭-통합 규칙 커스텀 가능(예: styleship → styleship)
      .replace(/styleship/gi, "styleship");

  // 2) 권한 규칙
  // - ADMIN: 모두 조회 가능
  // - USER: 같은 회사만 조회 가능(단, 둘 중 하나라도 STYLESHIP이면 허용)
  // - 자기 자신은 멘션 대상에서 제외(원하면 허용 가능)
  const canMention = (viewer, target) => {
    if (!viewer || !target) return false;

    const viewerId = String(viewer.id ?? "");
    const targetId = String(target.id ?? "");
    if (viewerId && targetId && viewerId === targetId) return false; // 자기 자신 제외

    if (String(viewer.role).toUpperCase() === "ADMIN") return true;

    const v = normalizeCompany(viewer.userCompany);
    const t = normalizeCompany(target.userCompany);

    // 같은 회사이거나, 둘 중 하나가 styleship이면 허용
    return !!(v && t && (v === t || v === "styleship" || t === "styleship"));
  };

  // 3) react-mentions가 요구하는 데이터 형태로 변환
  //    [{ id, display, avatar, company, title, team }]
  const mentionBase = useMemo(() => {
    return (userData || [])
      .filter((u) => canMention(currentUser, u)) // 로그인 사용자 기준 필터링
      .map((u, i) => ({
        id: String(u?.id ?? i), // id 없으면 index로 대체
        // 검색/표시/저장 마크업에 사용될 표시 이름
        display: u?.userName || u?.userId || String(u?.id ?? `user-${i}`),
        //display: u?.userName || u?.userId || `user-${i}`,
        avatar: u?.userImage,
        company: u?.userCompany || "기타",
        title: u?.jobTitle,
        team: u?.userTeam,
      }));
  }, [userData, currentUser]);

  // 4) 저장 포맷 → 사람이 읽는 포맷으로 변환
  //    "@" → "@홍길동"
  const humanize = (s) =>
    (s ?? "").replace(/\@\[(.+?)\]\((.+?)\)/g, (_m, display) => `@${display}`);

  // 5) 회사별 그룹화 + 검색 + 정렬 + 그룹 헤더 플래그(isFirstOfGroup)
  const buildGrouped = (query) => {
    const q = (query || "").toLowerCase();

    // (1) 검색: display 부분 일치
    const filtered = mentionBase.filter((u) =>
      (u.display || "").toLowerCase().includes(q)
    );

    // (2) 정렬: 회사명 → 이름순 (한국어 로케일 사용)
    filtered.sort((a, b) => {
      const gA = a.company || "";
      const gB = b.company || "";
      if (gA !== gB) return gA.localeCompare(gB, "ko");
      return (a.display || "").localeCompare(b.display || "", "ko");
    });

    // (3) 그룹 경계 감지 → 첫 항목에만 헤더를 보이도록 플래그 설정
    let prevGroup = null;
    return filtered.map((u, i) => {
      const group = u.company || "기타";
      const nextGroup = filtered[i + 1]?.company || null;
      const isFirstOfGroup = group !== prevGroup;
      const isLastOfGroup = group !== nextGroup; // 다음 항목이 다르면 라스트
      prevGroup = group;

      return { ...u, isFirstOfGroup, isLastOfGroup, groupLabel: group };
    });
  };

  // 6) react-mentions 데이터 프로바이더
  //    - query에 따라 필터링된 배열을 callback으로 전달
  const dataProvider = (query, callback) => {
    const list = buildGrouped(query);
    // 필요 시 여기서 slice(...)로 페이지네이션 가능
    callback(list);
  };


  return (
    <div>
      <MentionsInput
        className="mentionWrap"
        //style={styles} // 내부 레이어 최소 스타일
        value={value ?? ""} // 항상 문자열 유지
        onChange={(e) => onChange?.(e.target.value ?? "")} //부모로 전달
        placeholder="내용을 입력하세요."
        // 저장 마크업 포맷: @[표시이름](id)
        markup="@[__display__](__id__)"
        allowSuggestionsAboveCursor // 커서 위/아래 모두 제안 허용
        singleLine={false} // false면 textarea로 렌더링
        // 제안 목록을 별도 DOM에 렌더링해 z-index/overflow 문제 방지
        suggestionsPortalHost={portalRef.current || undefined}
      >

        <Mention
          trigger="@" // @ 입력 시 자동완성 시작
          data={dataProvider} // 자동완성 데이터 공급자
          markup="@[__display__](__id__)" // 저장 마크업(위 MentionsInput과 동일)
          // 편집 화면에서 보이는 텍스트(@홍길동)
          displayTransform={(_id, display) => `@${display}`}
          // 자동완성 항목 커스텀 렌더링
          renderSuggestion={(
            entry,
            search,
            highlightedDisplay,
            index,
            focused
          ) => {
            // react-mentions가 넘겨주는 하이라이트 문자열(HTML) 또는 ReactNode 처리
            const nameNode =
              typeof highlightedDisplay === "string" ? (
                <span
                  dangerouslySetInnerHTML={{ __html: highlightedDisplay }}
                />
              ) : (
                highlightedDisplay
              );

            return (
              <div>
                {/* 그룹 헤더: 회사명(그룹의 첫 항목에만 표시) */}
                {entry.isFirstOfGroup && (
                  <div className="company-name">{entry.groupLabel}</div>
                )}

                {/* 실제 선택 영역: 이름 + 직급만 노출 */}
                <div
                  className={`mentions__suggestions__row ${
                    focused ? "is-focused" : ""
                  }`}
                >
                  {/* 아바타(이미지 없으면 기본 이미지로 대체) */}
                  <img
                    src={entry.avatar || "/images/profile-default.jpg"}
                    alt=""
                    onError={(e) =>
                      (e.currentTarget.src = "/images/profile-default.jpg")
                    }
                  />
                  <div>
                    <div>{nameNode}</div>
                    {/* 직함/팀 정보가 있을 때만 보이도록 처리 */}
                    {entry.title && (
                      <small>
                        {entry.team} {entry.title}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
          
          // 멘션 선택 후 뒤에 공백 자동 추가(연속 입력 편의)
          appendSpaceOnAdd
        /> 


      </MentionsInput>

      {/* 제안 포털 루트: 제안 리스트 DOM을 여기로 렌더링 */}
      <div ref={portalRef} />
    </div>
  );
};

export default Mentions;
