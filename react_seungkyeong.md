# 🌱 컴포넌트 상태 관리 (React State Management)

## 1. `useState()` : 상태 선언과 변경

컴포넌트는 스스로 값을 기억하지 못하기 때문에  
`useState()` 훅을 이용해 값을 저장하고, 값이 바뀔 때마다 재렌더링하게 함.

### ✅ 문법 (개념 정리)
```js
const [value, setValue] = useState(초기값);
```

- `value`: 현재 상태값 (읽기 전용)
- `setValue`: 상태 변경 함수 (`setState`라고도 부름)

```js
const [count, setCount] = useState(0);
```

### ❌ 잘못된 예
```js
count = count + 1; // 직접 수정 → React는 변경 감지 못함
```

### ✅ 올바른 예
```js
setCount(count + 1); // 상태 변경 → 렌더링 발생
```

---

## 2. 실제 사용 예시

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(count + 1);
  };

  return (
    <>
      <p>현재 카운트: {count}</p>
      <button onClick={increase}>+1</button>
    </>
  );
}
```

### ✅ 다양한 상태값 예시
```js
const [count, setCount] = useState(0);        // 숫자
const [text, setText] = useState('');         // 문자열
const [isOpen, setIsOpen] = useState(false);  // 불리언
const [users, setUsers] = useState([]);       // 배열
```

---

## 3. 기본 이벤트

| HTML  | React       |
|-------|-------------|
| onclick | `onClick` |

### 예: onClick
```jsx
function AlertButton() {
  const handleClick = () => {
    alert('버튼을 눌렀습니다!');
  };

  return <button onClick={handleClick}>눌러보세요</button>;
}
```

### 예: onChange
```jsx
import { useState } from 'react';

function InputBox() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <input value={text} onChange={handleChange} />
      <p>입력값: {text}</p>
    </div>
  );
}
```

### 예: onSubmit
```jsx
function FormExample() {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`입력한 값: ${text}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">제출</button>
    </form>
  );
}
```

---

## 4. 조건부 렌더링 (Conditional Rendering)

### 1. `if` 문
```jsx
function Welcome({ isLogin }) {
  if (isLogin) {
    return <h1>환영합니다!</h1>;
  } else {
    return <h1>로그인 해주세요.</h1>;
  }
}
```

### 2. 삼항 연산자
```jsx
<p>{isLogin ? "로그아웃" : "로그인"}</p>
```

### 3. `&&` 연산자
```jsx
{isAdmin && <button>관리자 전용 버튼</button>}
```

### ✅ 로그인 상태 토글 예제
```jsx
function LoginToggle() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div>
      {isLogin ? <p>안녕하세요!</p> : <p>로그인해주세요.</p>}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
}
```

---

## 5. 상태 심화 사용법

### 1. 복수 상태
```jsx
const [name, setName] = useState("홍길동");
const [age, setAge] = useState(20);
```

### 2. 객체 상태
```jsx
const [user, setUser] = useState({ name: "기욱", age: 20 });

const changeAge = () => {
  setUser({ ...user, age: user.age + 1 });
};
```

### 3. prevState 패턴
```jsx
setCount(prev => prev + 1);
```

---

## 6. 리스트 렌더링

### map() 사용 예
```jsx
const names = ['기욱', '서연', '민준'];

<ul>
  {names.map((name, index) => (
    <li key={index}>{name}</li>
  ))}
</ul>
```

### 객체 배열 예
```jsx
const users = [
  { id: 1, name: '기욱' },
  { id: 2, name: '서연' },
];

<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
```

---

## 7. 리스트 추가

```jsx
function AddNameApp() {
  const [names, setNames] = useState(['기욱']);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    setNames([...names, input]);
    setInput('');
  };

  return (
    <div>
      <h2>이름 목록</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>추가</button>
      <ul>
        {names.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 8. key 충돌 주의사항

React의 Virtual DOM은 `key`를 기준으로 렌더링 최적화를 진행함.

- key는 반드시 **고유값**이어야 함.
- 중복되면 예상치 못한 렌더링 버그 발생 가능.

```js
// ❌ 잘못된 예
[
  { id: 1, name: '승경' },
  { id: 1, name: '기욱' }, // 중복 ID
]

// ✅ 고유한 key 보장
[
  { id: 1, name: '승경' },
  { id: 2, name: '기욱' },
]
```

---

## 9. 리스트 삭제 (filter)

```jsx
function UserList() {
  const [users, setUsers] = useState([
    { id: 1, name: '기욱' },
    { id: 2, name: '서연' },
    { id: 3, name: '민준' },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>삭제</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 10. 검색 필터 예시

```jsx
function SampleFilterSearch() {
  const initialUsers = [
    { id: 1, name: "승경" },
    { id: 2, name: "기욱" },
    { id: 3, name: "우주" },
    { id: 4, name: "태리" },
    { id: 5, name: "규재" },
    { id: 6, name: "지원" },
  ];

  const [search, setSearch] = useState("");

  const filteredUsers = initialUsers.filter((user) =>
    user.name.includes(search)
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>일치하는 사용자가 없습니다.</p>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## ✅ 과제 정리

| 과제                              | 활용 개념                      |
|-----------------------------------|--------------------------------|
| 버튼 누르면 숫자 올라가는 카운터 | `onClick`, `useState`         |
| 입력창에 입력한 글자 미러링       | `onChange`, `useState`        |
| 폼 제출 시 alert 띄우기           | `onSubmit`, `preventDefault`  |
| 마우스 오버 시 텍스트 바뀌기      | `onMouseEnter`, `useState`    |

---

