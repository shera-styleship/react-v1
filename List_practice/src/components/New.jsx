import './New.css'
import { useState, useContext } from 'react';
import { ProjectDispatchContext } from '../App';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const New = ()=>{
    const nav = useNavigate();
    const { onCreate } = useContext(ProjectDispatchContext);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 오늘 날짜로 초기화
    const [content, setContent] = useState('');
    
    const handleSubmit = ()=>{
        // 입력값 검증
        if(!title.trim()) {
            alert('프로젝트 제목을 입력해주세요.');
            return;
        }
        if(!content.trim()) {
            alert('프로젝트 내용을 입력해주세요.');
            return;
        }
        
        onCreate(title, date, content);
        nav('/project'); // 프로젝트 목록으로 이동
    }

    return (
        <div className="New">
            <div className="title_box">
                <input 
                    type="text" 
                    placeholder='프로젝트 제목을 입력하세요.'
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input 
                    type="date" 
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                />
            </div>
            <div className="content_box">
                <textarea
                    placeholder='프로젝트 내용을 입력하세요.'
                    value={content}
                    rows={10}
                    onChange={(e)=>setContent(e.target.value)}
                />
            </div>

            <div className="btn_box">
                <Button text={"저장"} onClick={handleSubmit} />
                <Button text={"취소"} onClick={()=> nav('/project')} />
            </div>
        </div>
    )
}
export default New;