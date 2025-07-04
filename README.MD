# [React] 초기 설정하는 방법


### 1. Node.js 및 npm  설치

React를 사용하려면 먼저 Node.js 와 npm(Node Package Manager) 설치해야함.
Node.js 는 Javascript 런타임환경, npm은 패키지 관리도구임.
Node.js 공식 사이트에서 LTS 최신버전 다운로드 후 설치
```
node -v
npm - v
```
위 명령어 입력하면 각각 Node.js 와 npm 버전 확인가능

### 2. React 프로젝트 생성
가장 간단한 방법 Facebook에서 제공하는 Create React App 도구를 사용.<br>
Create React App는 초기 설정을 자동으로 처리해줘서 편리함.

```
npx create-react-app my-app
```

### 3. 프로젝트 디렉토리로 이동
```
    cd my-app
    npm start
```
로컬 개발서버 스타트, 브라우저에서 http://localhoat:3000 으로 접속

### 4. 디렉토리 구조 이해하기
<code>public/</code>: 정적 파일이 위치하는 폴더 주로 <code>index.html</code> 파일이 있음.<br>
<code>src/</code>: 실제 개발을 진행하는 폴더로, React 컴포넌트와 자바스크립트 파일이 위치.<br>
<code>node_modules/</code>: 프로젝트에 필요한 모든 npm 패키지가 설치되는 폴더.<br>
<code>package.json</code>: 프로젝트 설정과 의존성 목록이 포함된 파일.


### 5. JSX 문법의 이해

JSX는  JavaScriptXML 의 약자로 React 에서 UI를 구성ㅇ하기 위해 사용되는 JavaScript 문법 확장임.

JSX는 HTML과 유사한 구문을 사용하여 React 컴포넌트의 구조를 정의하고 이를 통해 직관전으로 UI 구성할 수 있음.

-  html과 유사한 구문
```
const element = <h1>Hello, world!</h1>;
```
- Javascript 와 통합
```
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
```
-컴포넌트 렌더링
```
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

- JSX의 HTML 속성

class --> className
for --> htmlFor

CamelCase로 사용함.

- 꼭 하나의 부모요소로 감싸야함.
```
// ❌ 에러
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);

// ✅ 올바른 예시
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);
```

### 6.React 컴포넌트 기본개념
React는 UI 작은 단위로 나눈 '컴포넌트'로 구성

-함수형 컴포넌트(주로사용)
-클래스형 컴포넌트(구형)

```
function Header() {
  return (
    <header>
      <h1>사이트 헤더</h1>
    </header>
  );
}

export default Header;
```
App.js 에서 사용
```
import Header from './Header';

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

### 7. Props(데이터 전달)
부모 컴퍼넌트 --> 자식컴퍼넌트로 데이터 전달
```
function Welcome(props) {
  return <h1>안녕하세요, {props.name}님!</h1>;
}

function App() {
  return <Welcome name="홍길동" />;
}
```

### 8. State(상태관리)
컴퍼넌트 내부에서 변하는 값 관리
useState 사용

```
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

### 9.이벤트 처리
버튼 클릭 등 사용자 동작에 반응
```
<button onClick={() =>  alert('버튼 클릭!')}>클릭</button>
```

### 반복출력(map사용)
배열 데이터를 반복출력
```
const items = ['사과', '바나나', '포도'];

function ItemList() {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```