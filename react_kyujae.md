# React.js 데이터 처리 정리

## 1. 제어 컴포넌트 (Controlled Component)

**정의:**

-   React의 상태(state)로 값을 제어하는 입력 요소
    
-   `value`와 `onChange`를 모두 지정해 사용자 입력과 상태를 동기화함
    

**예시:**

https://codesandbox.io/p/sandbox/dazzling-dijkstra-fzr452?file=%2Fsrc%2FApp.js%3A20%2C1

```jsx
import { useState } from "react";

export default function Example() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="입력해보세요"
      />
      <p>
        현재 입력값: <strong>{inputValue}</strong>
      </p>
    </div>
  );
}

```

**특징:**

-   값은 `state`에 저장됨
    
-   입력값 검증, 초기화, 동기화가 쉬움
    

----------

## 2. 입력 폼 처리

**기본 구조:**

-   입력값을 모두 `state`로 관리
    
-   제출 시 `state` 값 활용
    

**예시:**

https://codesandbox.io/p/sandbox/vqyxtf?file=%2Fsrc%2FApp.js%3A29%2C19

```jsx
import { useState } from "react";

export default function FormWithPreview() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`제출 완료!\n이름: ${formData.name}\n이메일: ${formData.email}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>회원 가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            이름:{" "}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름 입력"
            />
          </label>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            이메일:{" "}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 입력"
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: "15px" }}>
          제출
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>🔎 입력 내용 미리보기</h3>
      <p>이름: {formData.name || "(미입력)"}</p>
      <p>이메일: {formData.email || "(미입력)"}</p>
    </div>
  );
}


```

-   제어 컴포넌트 = 단일 입력 처리

-   입력 폼 처리 = 제어 컴포넌트를 여러 개 묶어서 다루기

----------

## 3. Create (데이터 추가)

**설명:**

-   새 항목을 배열에 추가하는 기본 패턴
    

**예시:**

https://codesandbox.io/p/sandbox/phf2zs?file=%2Fsrc%2FApp.js%3A15%2C25

```jsx
import { useState } from "react";

export default function CreateExample() {
  const [items, setItems] = useState([]); // 항목을 저장할 배열
  const [newItem, setNewItem] = useState(""); // 입력값

  const handleAdd = () => {
    if (newItem.trim() === "") return; // 공백 입력은 무시
    setItems((prev) => [...prev, newItem]); // 기존 배열에 새 값 추가
    setNewItem(""); // 입력창 초기화
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 할 일 추가</h2>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="할 일 입력"
      />
      <button onClick={handleAdd} style={{ marginLeft: "10px" }}>
        추가
      </button>

      <ul style={{ marginTop: "20px" }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li> // 목록 출력
        ))}
      </ul>
    </div>
  );
}


```

----------

## 4. Update (데이터 수정)

**설명:**

-   배열의 특정 항목을 수정하는 패턴
    

**예시:**

https://codesandbox.io/p/sandbox/95yyz5?file=%2Fsrc%2FApp.js%3A48%2C1

```jsx
import { useState } from "react";

export default function UpdateExample() {
  // 기술 목록 초기값 설정
  const [items, setItems] = useState(["React", "Vue"]);
  // 수정 중인 항목의 인덱스를 저장
  const [editIndex, setEditIndex] = useState(null);
  // 사용자가 입력 중인 값을 저장
  const [editValue, setEditValue] = useState("");

  // 수정 시작: 어떤 항목을 수정할지 인덱스를 저장하고 해당 값을 editValue에 설정
  const startEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  // 수정 저장: 기존 배열을 복사하면서 수정 중인 항목만 새 값으로 교체
  const saveEdit = () => {
    const updatedItems = items.map((item, idx) =>
      idx === editIndex ? editValue : item
    );
    setItems(updatedItems); // 항목 목록 갱신
    setEditIndex(null); // 수정 모드 종료
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 기술 목록 (수정 가능)</h2>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            {editIndex === idx ? (
              // 수정 중인 항목이면 input 필드와 저장 버튼 표시
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)} // 입력 값 실시간 반영
                />
                <button onClick={saveEdit}>저장</button>
              </>
            ) : (
              // 수정 중이 아니라면 항목과 수정 버튼 표시
              <>
                {item} <button onClick={() => startEdit(idx)}>수정</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


```
