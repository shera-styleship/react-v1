import './Project.css'
import List from '../components/List'
import View from '../components/View'
import ProjectForm from '../components/ProjectForm'

import { useContext } from 'react'
import { ProjectStateContext } from '../App'
import { Routes, Route, useNavigate } from 'react-router-dom'

const Project = ()=> {
    const data = useContext(ProjectStateContext);
    const nav = useNavigate();
    
    return (
        <div className="Project">
            <div className="wrapper">
                <div className="list_box">
                    <List 
                        data={data} 
                        onSelect={(id) => {
                            nav(`/project/${id}`)
                        }} 
                        onNew={()=>{
                            nav('/project/new')
                        }}
                    />
                </div>
                <div className="view_box">
                    <Routes>
                        <Route index element={<p className='no-txt'>프로젝트를 선택해주세요.</p>} />
                        <Route path="new" element={<ProjectForm mode="new"/>} />
                        <Route path=":id" element={<View />} />
                        <Route path=":id/edit" element={<ProjectForm mode="edit" />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
export default Project;