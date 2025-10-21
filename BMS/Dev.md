## 🧩 React 모듈 분리 가이드

### 📌 문서 목적

리액트 프로젝트의 모듈 구조와 역할을 명확히 정의하여,  
개발자 간의 일관된 코드 구조와 협업 효율을 높이기 위한 문서입니다.

### 🏗️ 프로젝트 개요

- **프로젝트명:** Styleship Bms Project
- **목적:** 스타일쉽 bms 리뉴얼
- **개발 스택:** React + Vite + React Router
- **버전 관리:** GitHub

### 폴더구조

```plaintext
src/
 ├── components/
 │    ├── common/        # 공용 컴포넌트 (Button, Input 등)
 │    ├── layout/        # 페이지 레이아웃 구성 요소 (Header, Lnb 등)
 │    ├── feature/       # 기능 단위 컴포넌트 (ProjectList, ProjectView 등)
 │    └── network        # IP 관리
 │
 ├── layouts/            # 페이지 분기점 
 ├── pages/              # 라우트 페이지 컴포넌트 
 ├── hooks/              # 커스텀 훅
 ├── utils/              # 유틸 함수, 상수, API
 ├── assets/             # 이미지, 아이콘, 스타일
```

### 컴포넌트/모듈 분리 기준

| 구분        | 설명                           | 예시                                 |
| ----------- | ------------------------------ | ------------------------------------ |
| **Common**  | 공통 UI 요소        | `Alert`, `Button`, `Input`, `Select`           |
| **Layout**  | 페이지 공통 구조               | `Header`, `Lnb` |
| **Feature** | 특정 기능 담당, 내부 상태 포함 | `ProjectList`, `ProjectView`, `ProjectFilterBar`, `ProjectItem`, `NewProject`    |
| **Utils**   | 순수 함수, API 모듈, 포맷터    | `constants`, `getUserImageSrc`            |
| **Hooks**   | 로직 재사용을 위한 커스텀 훅   |     |


### 📘 주요 컴포넌트 설명

| 📁 폴더 | 🧩 파일명 | 📝 설명 |
|:--|:--|:--|
| **components/common/** | `Button.jsx` | 기본 버튼 컴포넌트 |
|  | `Input.jsx` | 공통 인풋 필드 |
|  | `Select.jsx` | 커스텀 셀렉트 박스 |
|  | `Alert.jsx` | 알림/확인 팝업 레이어 |
| **components/layout/** | `Header.jsx` | 상단 헤더 |
|  | `Lnb.jsx` | 좌측 내비게이션 |
| **components/feature/** | `NewProject.jsx` | 새 프로젝트 등록 컴포넌트 |
|  | `ProjectList.jsx` | 프로젝트 리스트 렌더링 컴포넌트 |
|  | `ProjectFilterBar.jsx` | 프로젝트 리스트 내 필터링 기능 |
|  | `ProjectItem.jsx` | 프로젝트 리스트 내 아이템 렌더링 |
|  | `ProjectView.jsx` | 새 프로젝트 생성 또는 아이템 클릭 시 렌더링되는 프로젝트 상세 |
| **layouts/** | `AuthLayout.jsx` | 로그인 레이아웃 |
|  | `AppLayout.jsx` | 로그인 이후 공통 레이아웃 (Header, Lnb 포함) |
| **pages/** | `Login.jsx` | 로그인 페이지 |
|  | `Project.jsx` | 프로젝트 (리스트 + 상세 구성) |
| **utils/** | `constants.js` | 공용 상수 정의 |
|  | `getUserImageSrc.js` | 사용자 프로필 이미지 경로 반환 함수 |


