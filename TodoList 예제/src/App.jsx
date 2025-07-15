import './App.css'
import Header from "./components/Header"
import List from "./components/List"
import Editor from "./components/Editor"
import { useState, useRef } from 'react'

function App() {
  const mockData = [
    {
      id:0,
      isDone: false,
      content: "React 공부하기",
      date: new Date().getTime(),
    },
    {
      id:1,
      isDone: true,
      content: "집에 가기",
      date: new Date().getTime(),
    },
    {
      id:2,
      isDone: false,
      content: "게임하기",
      date: new Date().getTime(),
    }
  ]
  
  const [todos, setTodos] = useState(mockData)
  const idRef = useRef(3)

  const onCreate = (content) => {
    const newTodo = {
      id : idRef.current++,
      isDone : false, 
      content : content,
      date : new Date().getTime()
    }
    setTodos([newTodo, ...todos])
  }

  const onDelete = (targetId) => {
    setTodos(
      todos.filter((todo) => 
        todo.id !== targetId
      )
    )
  }

  // 인수 : todos 배열에서 targetId와 일치하는 id를 갖는 요소의 데이터만 딱 바꾼 새로운 배열
  const onUpdate = (targetId) => {
    setTodos(todos.map((todo)=>{
      if(todo.id === targetId){
        return {
          ...todo,
          isDone: !todo.isDone
        }
      }
      return todo
    }))
  }
  
  return (
    <div className='App'>
      <Header />
      <Editor onCreate={onCreate} />
      <List todos={todos} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  )
}

export default App
