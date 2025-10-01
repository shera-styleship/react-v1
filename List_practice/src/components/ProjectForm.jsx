import './ProjectForm.css'
import { useState, useContext, useEffect } from 'react';
import { ProjectDispatchContext, ProjectStateContext } from '../App';
import Button from './Button';
import { useParams, useNavigate } from 'react-router-dom';
import getStringedDate from '../util/get-stringed-date';

const ProjectForm = ({ mode = 'new' })=>{
    const { id } = useParams();
    const nav = useNavigate();

    const data = useContext(ProjectStateContext);
    const { onCreate, onUpdate } = useContext(ProjectDispatchContext);

    const project = mode === 'edit' ? data.find((item) => String(item.id) === String(id)) : null;
    if (mode === 'edit' && !project) {
        return <p>데이터를 찾을 수 없습니다.</p>;
    }

    const [title, setTitle] = useState(project ? project.projectTitle : '');
    const [date, setDate] = useState(
        project ? getStringedDate(project.createdDate) : getStringedDate(Date.now())
    );
    const [content, setContent] = useState(project ? project.content : '');

    // 수정 > 작성 변경시 내용물 변경
    useEffect(()=>{
      if (mode === 'new') {
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setContent('');
        } else if (mode === 'edit' && project) {
            setTitle(project.projectTitle);
            setDate(new Date(project.createdDate).toISOString().split('T')[0]);
            setContent(project.content);
        }
    }, [mode, id, project]);
    
    const handleSubmit = () => {
        // 입력값 검증 (New 모드일 때만)
        if (mode === 'new') {
            if (!title.trim()) {
                alert('프로젝트 제목을 입력해주세요.');
                return;
            }
            if (!content.trim()) {
                alert('프로젝트 내용을 입력해주세요.');
                return;
            }
        }

        const parsedDate = new Date(date).getTime();
        
        if (mode === 'new') {
            onCreate(title, parsedDate, content);
            nav('/project');
        } else {
            onUpdate(Number(id), title, parsedDate, content);
            nav(`/project/${id}`);
        }
    };
    
    const handleCancel = () => {
        if (mode === 'new') {
            nav('/project');
        } else {
            nav(`/project/${id}`);
        }
    };

    return (
        <div className="ProjectForm">
            <h2>{mode === 'new' ? '새 프로젝트 작성하기' : '프로젝트 수정하기'}</h2>

            <div className="form_box">
                <div className="title_box">
                    <input
                        type="text"
                        placeholder={mode === 'new' ? '프로젝트 제목을 입력하세요.' : ''}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='title'
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className='date'
                    />
                </div>
                <div className="content_box">
                    <textarea
                        placeholder={mode === 'new' ? '프로젝트 내용을 입력하세요.' : ''}
                        value={content}
                        rows={10}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="btn_box">
                    <Button text={"저장"} onClick={handleSubmit} type={'NEW'} />
                    <Button text={"취소"} onClick={handleCancel} />
                </div>
            </div>
            
        </div>
    )
}
export default ProjectForm;