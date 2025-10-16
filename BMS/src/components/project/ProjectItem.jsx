import Select from "../form/Select";
import { useState } from "react";

const ProjectItem = ()=>{
    const [status, setStatus] = useState("receipt");

    const statusOptions = [
        { value: "receipt", label: "접수" },
        { value: "progress", label: "진행" },
        { value: "hold", label: "보류요청" },
        { value: "completion", label: "완료요청" },
        { value: "cancel", label: "취소" }
    ];

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };   

    return (
        <div className="ProjectItem">
            <p className="date">10-10</p>
            <p className="number">84739</p>
            <p className="brand">APTE</p>
            <p className="type">기획전</p> 
            <p className="title">
                ○ [키즈] WINTER VACANCE 다운 프리오더 (8/13~9/21)
                <span class="tag">CR</span> <span className="tag">@</span> <span className="tag new">N</span>
            </p>
            <Select 
                name="status"
                value={status}
                options={statusOptions}
                onChange={handleStatusChange}
                className={`_status _${status}`}
            />
        </div>
    )
}

export default ProjectItem;