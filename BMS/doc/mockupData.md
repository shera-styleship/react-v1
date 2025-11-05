
# 목업데이터

## 1. userInfo(임시 유저 데이터)

| 필드명          | 타입     | 설명               | 예시                        |
| :----------- | :----- | :--------------- | :------------------------ |
| id           | string | 유저 고유값 (DB 기본키)  | `"0"`                     |
| userId       | string | 로그인 아이디          | `"test01"`                |
| userPassword | string | 로그인 비밀번호         | `"1234"`                  |
| userName     | string | 유저 이름            | `"홍길동"`                   |
| userImage    | string | 프로필 이미지 경로 (URL) | `"/images/profile01.jpg"` |
| userPhone    | string | 전화번호             | `"010-0000-0000"`         |
| userCompany  | string | 소속 회사명           | `"NPLUS(네파)"`             |
| jobTitle     | string | 직급               | `"과장"`                    |

<br>

## 2. projectList (임시 프로젝트 리스트)
| 필드명             | 타입     | 설명                                                          | 예시                                            |
| :-------------- | :----- | :---------------------------------------------------------- | :-------------------------------------------- |
| id              | string | 프로젝트 고유 ID                                                  | `"0"`                                         |
| writer          | string | 작성자 이름                                                      | `"홍길동"`                                       |
| projectNo       | number | 프로젝트 번호                                                     | `84739`                                       |
| projectDate     | string | 작성일 (YYYY-MM-DD)                                            | `"2025-08-06"`                                |
| projectCompany  | string | 고객사 이름                                                      | `"NPLUS(네파)"`                                 |
| projectBrand    | string | 브랜드명 (2차 분류)                                                | `"NEPA"`                                      |
| projectSort     | string | 프로젝트 분류 (기획전, 이벤트 등)                                        | `"외부몰"`                                       |
| projectTitle    | string | 프로젝트 제목                                                     | `"○ [키즈] WINTER VACANCE 다운 프리오더 (8/13~9/21)"` |
| projectStatus   | string | 상태값 (`receipt`, `progress`, `hold`, `completion`, `cancel`) | `"completion"`                                |
| projectDeadline | string | 마감일 (YYYY-MM-DD)                                            | `"2025-10-20"`                                |
| projectContent  | string | 상세 내용                                                       | `"라이카 카메라 코리아 기획전 제작 요청드립니다."`                |
| projectTeam | string[] | 담당 팀명 배열 <br>기존 단일 문자열(`"SR"`) → 다중 값 배열로 변경됨 | `["DV", "SR"]` |
| projectManager | string[] | 프로젝트 담당자 ID 목록  | `["test02", "test99"]` |

<br>

## 3. comments (임시 댓글 리스트)
| 필드명         | 타입                   | 설명                                               | 예시                           |
| :---------- | :------------------- | :----------------------------------------------- | :--------------------------- |
| `id`        | string               | 코멘트 구분을 위한 고유값              | `"0b03"`                     |
| `projectId` | string               | 코멘트가 속한 프로젝트의 ID                           | `"84750"`                    |
| `userId`    | string               | 코멘트를 작성한 사용자 ID (`userInfo`의 `id`)            | `"0"`                        |
| `text`      | string               | 코멘트 내용. 멘션 포함 시 @[홍길동](0) 형태로 저장  |                              |
| `file`      | boolean *(optional)* | 파일 첨부 여부 (`true`일 경우 `text`에 파일명 저장)            | `true`                       |
| `createdAt` | string               | 작성 시각 (ISO 8601 형식)                              | `"2025-11-04T08:20:08.203Z"` |


