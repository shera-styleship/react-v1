## React 프로젝트 초기 세팅

### Create React App  
```bash
npx create-react-app 프로젝트명
cd 프로젝트명
npm start
```

### Vite (가장 빠름)
```bash
npm create vite@latest
# → 프로젝트명 입력 → React → JavaScript 선택
cd 프로젝트명
npm install
npm run dev
```

---


## Node.js 환경 설정

### [nodejs.org](https://nodejs.org)에서 설치  
설치 후 확인법:  
  ```bash
  node -v
  npm -v
  ```

### 프로젝트 초기화  
  ```bash
  npm init
  ```

### `index.js` 실행
  ```bash
  node src/index.js
  ```

### `package.json`에서 scripts 지정
  ```json
  "scripts": {
    "start": "node src/index.js"
  }
  ```

### 실행 명령어
  ```bash
  npm run start
  ```

---

## 모듈 시스템 이해

### CommonJS 방식
예시 1
**math.js**
```js
function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
module.exports = { add, sub };
```

**사용할 파일에서**
```js
const { add, sub } = require('./math');
console.log(add(1, 2)); // 3
```

### ✅ ES Module 방식(대중적 방식)
`package.json`에 추가
  ```json
  "type": "module"
  ```
  *추가할 경우 CommonJS 방식은 더이상 작동하지 않음.

**math.js**
```js
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }
```

**사용할 파일에서**
```js
import mul, { add } from './math.js';
console.log(mul(2, 3)); // 6
```

---

## JSX 문법 및 주의사항

###  JSX란?
- HTML + JavaScript 혼합 문법
- JSX 내부에서는 `{}` 안에 JavaScript 표현식 사용 가능

**예시**
```jsx
const myName = "홍길동";

return (
  <div>
    <h1>안녕, 내 이름은 {myName}이야</h1>
  </div> 
  // 출력값 : 안녕, 내 이름은 홍길동이야
)
```

###  주의사항
- 최상위 태그는 반드시 하나  
  → 여러 요소를 묶을 땐 `<></>` 사용
- 모든 태그는 닫아야 함 (`<img />`)
- `{}` 안에는 표현식만 가능  
  → `if`, `for`문 직접 사용 불가
- `class`는 `className`, `style`은 camelCase (`backgroundColor`)
- 숫자, 문자열, 배열 값만 렌더링됨. `true`, `undefined`, `null`은 렌더링되지 않음

---

##  컴포넌트 이해

###  함수형 컴포넌트 기본 형태
함수 이름은 대문자로 시작
```jsx
function Header() {
  return <h1>타이틀</h1>;
}

export default Header;
```

###  JSX에서 컴포넌트 사용
```jsx
import Header from "./Header";

function App() {
  return (
    <>
      <Header />
      <p>안녕하세요</p>
    </>
  );
}
```

---

##  import / export 문법 정리

### Default Export vs Named Export
**Default Export**
- 한 파일에 하나만 가능
- import시 이름 지정 가능
- 컴포넌트 하나 중심의 파일에서 유용

**Named Export**
- 한 파일에서 여러개 가능
- import할 때 export했던 이름을 중괄호로 감싸서 가져와야 함


### 함수 선언과 동시에 Default Export
**내보낼 파일**
  ```js
  export default function Color() {}
  ```
  **가져올 파일**
  ```js
  import Color from './Color';
  ```

### 함수 선언을 위에서 하고 Default Export
**내보낼 파일**
  ```js
const Color = () => {};
export default Color;
  ```
  **가져올 파일**
  ```js
  import Color from './Color'
  ```

### Named Export
 **내보낼 파일**
  ```js
  export const Color = () => {};
  ```
  **가져올 파일**
  ```js
  import { Color } from './Color'
  ```
  
### Default Export + Named Export
 **내보낼 파일**
  ```js
const Color = () => {};
const Red = () => {};
const Blue = () => {};

export default Color;
export { Red, Blue };
  ```
  **가져올 파일**
  ```js
import Color, { Red, Blue } from './Color';
  ```
---

## Props / State
### Props : 부모가 자식에게 전달하는 데이터
 ```js
const Button = (props) => {
  console.log(props); // { text: "메일", color: "red" } 이런 식으로 전체 props가 객체로 출력됨
  return <button>클릭</button>;
};

export default Button;
```
```js
import Button from "./Button";

function App() {
  return (
    <>
      <Button text="메일" color="red" />
      <Button text="카페" />
      <Button text="블로그" />
    </>
  );
}

export default App;
```

**기본값(default Props), 구조분해할당**
```js
const Button = ({ text, color = "black" }) => {
  return <button style={{ color }}>{text}</button>;
};
```

**스프레드 연산자**
```js
const buttonProps = {
  text: "메일",
  color: "red",
  a: 1,
  b: 2,
  c: 3,
};

<Button {...buttonProps} />
```

**Children Prop(태그 사이에 넣은 내용은 children이라는 prop에 저장됨)**
```js
<Button text="카페">
  <div>자식 요소</div>
</Button>
```

### State: 동적인 데이터
- 컴포넌트 내부에서 상태를 관리
- 상태가 바뀌면 자동으로 리렌더링
- 컴포넌트 1개에 여러개의 State를 가질 수 있음

```js
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </>
  );
}

export default Counter;

```

---

## 필수 툴 및 확장 기능

### ESlint  
- 문법 오류, 권장 패턴 경고

### React Developer Tools  
- 브라우저에서 컴포넌트 구조와 state, props 실시간 확인 가능



