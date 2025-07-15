import './Editor.css'
import { useState, useRef } from 'react'

const Editor = ({onCreate}) => {
    const [content, setContent] = useState("")

    const contentRef = useRef()

    const onChangeContent = (e) => {
        setContent(e.target.value)
    }

    const onSubmit = () => {
        if(content === ""){
            contentRef.current.focus()
            return
        }
        // 아무것도 안썼을때 쓰라고 돌려보내기
        onCreate(content)
        setContent("")
        // 뭘써서 입력된다면 input 비워주기
    }
    const onKeyDown = (e) => {
        if(e.keyCode === 13) {
            // e.keyCode === 13 : 엔터
            onSubmit()
            // 엔터쳐도 추가되게 하기
        }
    }
    return <div className='Editor'> 
            <input ref={contentRef} value={content} onKeyDown={onKeyDown} onChange={onChangeContent} placeholder='새로운 Todo' />
            <button onClick={onSubmit}>추가</button>
        </div>
}

export default Editor