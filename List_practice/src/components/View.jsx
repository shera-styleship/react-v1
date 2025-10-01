import './View.css'
import Button from './Button';
import { useContext } from 'react';
import { ProjectDispatchContext, ProjectStateContext } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import getStringedDate from '../util/get-stringed-date';

const View = ()=>{
    const {id} = useParams();
    const nav = useNavigate();

    const data = useContext(ProjectStateContext);
    const {onDelete} = useContext(ProjectDispatchContext);

    const project = data.find((item)=>String(item.id) === String(id));
    if(!project) return <p className='no-txt'>데이터를 찾을 수 없습니다.</p>

    return (
        <div className="View">
            <h2>VIEWER</h2>

            <div className='wrap'>
                <div className="title_box">
                    <p className='title'>{project.projectTitle}</p>
                    <p className='date'>{getStringedDate(project.createdDate)}</p>
                </div>
                <div className="content_box">
                    <p>{project.content}</p>
                </div>
                <div className="btn_box">
                    <Button text={"수정"} onClick={()=>nav(`/project/${id}/edit`)} />
                    <Button 
                        text={"삭제"} 
                        onClick={()=>{
                            if(window.confirm('정말로 삭제하시겠습니까?')){
                                onDelete(project.id);
                                nav('/project');
                            }
                        }} 
                        type={'DELETE'}
                    />
                </div>
            </div>
        </div>
    )
}
export default View;