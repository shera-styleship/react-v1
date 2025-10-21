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
 │    ├── common/        # 공용 컴포넌트 (Button, Modal, Input 등)
 │    ├── layout/        # 페이지 레이아웃 구성 요소 (Header, Footer 등)
 │    └── feature/       # 기능 단위 컴포넌트 (Login, Signup, Profile 등)
 │
 ├── hooks/              # 커스텀 훅 (useForm, useFetch 등)
 ├── pages/              # 라우트 페이지 컴포넌트
 ├── utils/              # 헬퍼함수 및 유틸리티 모듈
 ├── assets/             # 이미지, 아이콘, 폰트
```

### 컴포넌트/모듈 분리 기준

| 구분        | 설명                           | 예시                                 |
| ----------- | ------------------------------ | ------------------------------------ |
| **Common**  | 공통 UI 요소, 상태 없음        | `Button`, `Input`, `Badge`           |
| **Feature** | 특정 기능 담당, 내부 상태 포함 | `LoginForm`, `SignupForm`, `List`    |
| **Layout**  | 페이지 공통 구조               | `Header`, `Sidebar`, `MainContainer` |
| **Hooks**   | 로직 재사용을 위한 커스텀 훅   | `useInput`, `useModal`, `useAuth`    |
| **Utils**   | 순수 함수, API 모듈, 포맷터    | `formatDate`, `apiClient`            |
