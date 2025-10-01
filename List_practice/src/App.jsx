import './App.css'
import Project from './pages/Project';
import { useReducer, createContext, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// 임시데이터
const mockData = [
  {
    id: 1,
    projectTitle: '1번 프로젝트입니다.',
    createdDate: new Date("2025-09-01").getTime(),
    content: '1번 글 내용입니다.'
  },{
    id: 2,
    projectTitle: '2번 프로젝트입니다.',
    createdDate: new Date("2025-09-02").getTime(),
    content: '2번 글 내용입니다.'
  },{
    id: 3,
    projectTitle: '3번 프로젝트입니다.',
    createdDate: new Date("2025-09-03").getTime(),
    content: '3번 글 내용입니다.'
  }
]

function reducer (state, action){
  switch(action.type){
    case "CREATE": return [action.data, ...state];
    case "UPDATE": return state.map((item)=>
      String(item.id) === String(action.data.id)
      ? action.data 
      : item
    );
    case "DELETE": return state.filter(
      (item)=> String(item.id) !== String(action.id)
    );
    default: return state;
  }
}

export const ProjectStateContext = createContext();
export const ProjectDispatchContext = createContext();

function App() {

  const [data, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(4);

  // 1. data 추가
  const onCreate = (projectTitle, createdDate, content)=>{
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        projectTitle,
        createdDate,
        content,
      }
    })
  }

  // 2. data 수정
  const onUpdate = (id, projectTitle, createdDate, content)=>{
    dispatch({
      type: "UPDATE",
      data: {
        id, projectTitle, createdDate, content,
      }
    })
  }

  // 3. data 삭제
  const onDelete = (id)=>{
    dispatch({
      type: "DELETE",
      id: id,
    })
  }

  return (
    
    <ProjectStateContext.Provider value={data}>
      <ProjectDispatchContext.Provider value={{onCreate, onUpdate, onDelete}}>
        <div className="App">
          <Link to={"/"} className='app_title'>UI PROJECT</Link>
          <Routes>
            <Route path="*" element={<Project />} />
            <Route path="/project/*" element={<Project/>} />
          </Routes>
        </div>
      </ProjectDispatchContext.Provider>
    </ProjectStateContext.Provider>
    
  )
}

export default App
