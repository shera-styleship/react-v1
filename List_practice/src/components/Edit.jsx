import './Edit.css'
import { useState, useContext } from 'react';
import { ProjectDispatchContext, ProjectStateContext } from '../App';
import Button from './Button';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ()=>{
    const {id} = useParams();
    const nav = useNavigate();

    const data = useContext(ProjectStateContext);
    const {onUpdate} = useContext(ProjectDispatchContext);

    const project = data.find((item)=> String(item.id) === String(id));
    if(!project) {return <p>데이터를 찾을 수 없습니다.</p>}

    const [title, setTitle] = useState(project.projectTitle);
    const [date, setDate] = useState(project.createdDate);
    const [content, setContent] = useState(project.content);

    const handleSubmit = ()=>{
        onUpdate(Number(id), title, date, content);
        nav(`/project/${id}`);
    }

    return (
        <div className="Edit">
            <div className='title_box'>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input 
                    type="date" 
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                />
            </div>
            <div className='content_box'>
                <textarea 
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                ></textarea>
            </div>
            <div className='btn_box'>
                <Button text={"저장"} onClick={handleSubmit} />
                <Button text={"취소"} onClick={()=> nav(`/project/${id}`)} />
            </div>
        </div>
    )
}
export default Edit;