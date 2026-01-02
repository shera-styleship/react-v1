// src/components/feature/Mentions.jsx
import "@components/feature/Mentions.css";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { API_BASE } from "@/utils/env";

const Mentions = ({ value, onChange, currentUser, onSubmit }) => {
  const [userData, setUserData] = useState([]);
  const portalRef = useRef(null);

  // 1) json-server 에서 사용자 목록 가져오기
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/userInfo`);
        if (!res.ok) {
          console.warn("userInfo API not available.");
          setUserData([]);
          return;
        }
        const list = await res.json();
        const arr = Array.isArray(list)
          ? list
          : Array.isArray(list?.userInfo)
          ? list.userInfo
          : [];
        setUserData(arr || []);
      } catch (e) {
        console.error(e);
        setUserData([]);
      }
    })();
  }, []);

  // 회사명 정규화
  const normalizeCompany = (c) =>
    String(c ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/styleship/gi, "styleship");

  // 2) 권한 규칙
  const canMention = (viewer, target) => {
    if (!target) return false;
    if (!viewer) return true;

    const viewerId = String(viewer.id ?? "");
    const targetId = String(target.id ?? "");

    // 자기 자신 제외
    if (viewerId && targetId && viewerId === targetId) return false;

    // role 없으면 ADMIN처럼
    const viewerRole = String(viewer.role || "ADMIN").toUpperCase();
    if (viewerRole === "ADMIN") return true;

    const v = normalizeCompany(viewer.userCompany);
    const t = normalizeCompany(target.userCompany);

    return !!(v && t && (v === t || v === "styleship" || t === "styleship"));
  };

  // 3) react-mentions용 데이터
  const mentionBase = useMemo(() => {
    const src = userData || [];
    return src
      .filter((u) => canMention(currentUser, u))
      .map((u, i) => ({
        id: String(u?.id ?? i),
        display: u?.userName || u?.userId || String(u?.id ?? `user-${i}`),
        avatar: u?.userImage,
        company: u?.userCompany || "기타",
        title: u?.jobTitle,
        team: u?.userTeam,
      }));
  }, [userData, currentUser]);

  // 4) 회사별 그룹화 + 검색 + 정렬
  const buildGrouped = (query) => {
    const q = (query || "").toLowerCase();

    const filtered = mentionBase.filter((u) =>
      (u.display || "").toLowerCase().includes(q)
    );

    filtered.sort((a, b) => {
      const gA = a.company || "";
      const gB = b.company || "";
      if (gA !== gB) return gA.localeCompare(gB, "ko");
      return (a.display || "").localeCompare(b.display || "", "ko");
    });

    let prevGroup = null;
    return filtered.map((u, i) => {
      const group = u.company || "기타";
      const nextGroup = filtered[i + 1]?.company || null;
      const isFirstOfGroup = group !== prevGroup;
      const isLastOfGroup = group !== nextGroup;
      prevGroup = group;

      return { ...u, isFirstOfGroup, isLastOfGroup, groupLabel: group };
    });
  };

  // 5) react-mentions 데이터 공급자
  const dataProvider = (query, callback) => {
    const list = buildGrouped(query);
    callback(list);
  };

  // ✅ 추천 목록 열려있으면 Enter는 "선택" 용도로 쓰이기 때문에 전송 막기
  const isSuggestionOpen = useCallback(() => {
    // react-mentions 기본 클래스들(버전에 따라 조금 다를 수 있어 방어적으로 체크)
    const root =
      document.querySelector(".mentions__suggestions") ||
      document.querySelector(".mentions__suggestions__list") ||
      document.querySelector(".mentions__suggestions__item");
    if (!root) return false;

    // 화면에 실제로 보이는지 체크
    const el = root.classList?.contains("mentions__suggestions")
      ? root
      : root.closest(".mentions__suggestions") || root;
    if (!el) return true;
    return !!(el.offsetParent !== null);
  }, []);

  const handleKeyDown = (e) => {
    // 한글 IME 조합 중 Enter는 무시
    if (e.nativeEvent?.isComposing) return;

    if (e.key === "Enter") {
      // 멘션 추천창 열려있으면 Enter는 선택용
      if (isSuggestionOpen()) return;

      // Shift or Ctrl 눌린 상태 → 줄바꿈
      if (e.shiftKey || e.ctrlKey) {
        e.preventDefault(); // react-mentions가 엔터 먹는 경우 방지
        onChange?.((value ?? "") + "\n");
        return;
      }

      // 그냥 Enter → 전송
      e.preventDefault();
      e.stopPropagation();
      onSubmit?.();
    }
  };

  return (
    <div>
      <MentionsInput
        className="mentionWrap"
        value={value ?? ""}
        onChange={(e, newValue) => {
          onChange?.(newValue ?? "");
        }}
        onKeyDown={handleKeyDown}
        placeholder="내용을 입력하세요. @를 입력하면 멘션이 가능합니다."
        markup="@[__display__](__id__)"
        allowSuggestionsAboveCursor
        singleLine={false}
        suggestionsPortalHost={portalRef.current || undefined}
      >
        <Mention
          trigger="@"
          data={dataProvider}
          markup="@[__display__](__id__)"
          displayTransform={(_id, display) => `@${display}`}
          renderSuggestion={(
            entry,
            search,
            highlightedDisplay,
            index,
            focused
          ) => {
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
                {entry.isFirstOfGroup && (
                  <div className="company-name">{entry.groupLabel}</div>
                )}

                <div
                  className={`mentions__suggestions__row ${
                    focused ? "is-focused" : ""
                  }`}
                >
                  <img
                    src={entry.avatar || "/images/profile-default.jpg"}
                    alt=""
                    onError={(e) =>
                      (e.currentTarget.src = "/images/profile-default.jpg")
                    }
                  />
                  <div>
                    <div>{nameNode}</div>
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
          appendSpaceOnAdd
        />
      </MentionsInput>

      {/* 제안 포털 루트 */}
      <div ref={portalRef} />
    </div>
  );
};

export default Mentions;
