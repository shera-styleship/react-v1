## API
읽기만 가능

**
**Json을 불러오던 컴포넌트 파일을 열어 import 아래에 내용 추가**

https://my-json-server.typicode.com/<깃허브ID>/<레포이름>

    // 파일 제일 위 어딘가( import 아래 )
    const API_BASE = import.meta.env.PROD
      ? "https://my-json-server.typicode.com/kjssong/mock-api"
      : "http://localhost:4000";


**fectch() 경로 변경**

기존

    const res = await fetch("http://localhost:4000/userInfo");

변경

    const res = await fetch(`${API_BASE}/userInfo`);


**깃허브에 json 추가**

공개 레포를 mock-api 로 생성

생성 후 mock-api 안에 db.json 파일 추가
