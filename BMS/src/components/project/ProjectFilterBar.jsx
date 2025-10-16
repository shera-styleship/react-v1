import { useState } from "react";
import Select from "../form/Select";
import Input from "../form/Input";

const ProjectFilterBar = ()=>{
    const [filters, setFilters] = useState({
        company: "",
        brand: "",
        team: "",
        keyword: "",
    });

    const handleSelect = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log("검색 실행:", filters.keyword);
    }
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    const selectOptions = [
        {
            name: "company",
            options: [
                { value: "", label: "Company" },
                { value: "all", label: "All" },
                { value: "lotte", label: "롯데홈쇼핑" },
                { value: "columbia", label: "컬럼비아" },
            ],
        },
        {
            name: "brand",
            options: [
                { value: "", label: "Brand" },
                { value: "all", label: "All" },
                { value: "goldengoose", label: "골든구스" },
                { value: "columbia", label: "컬럼비아" },

            ],
        },
        {
            name: "team",
            options: [
                { value: "", label: "All" },
                { value: "cr", label: "CR" },
                { value: "dv", label: "DV" },
                { value: "uxi", label: "UXI" },
                { value: "sr", label: "SR" }
            ],
        },
    ];

    return (
        <div className="ProjectFilterBar">
            <div>
                <div className="select-box">
                    {selectOptions.map(({ name, options }) => (
                        <Select
                            key={name}
                            name={name}
                            value={filters[name]}
                            options={options}
                            onChange={handleSelect}
                            className={`_${name}`}
                        />
                    ))}
                </div>
                <div className="input-box">
                    <Input 
                        inputValue={filters.keyword}
                        setValue={(val) => setFilters((prev)=>({ ...prev, keyword : val }))}
                        onKeyDown = {handleKeyPress}
                    />
                    <button type="button" className="pj-search__btn" onClick={handleSearch}></button>
                </div>
            </div>
            
            <div className="">
                <div className="status-box">
                    <button type="button" className="on">접수/진행 프로젝트</button>
                    <button type="button">완료/취소 프로젝트</button>
                </div>
                <div className="date-box">
                    <input type="date" name="" id="" />
                    ~
                    <input type="date" name="" id="" />
                    <button type="button" className="pj-date__btn">조회</button>
                </div>
            </div>
        </div>
    )
}

export default ProjectFilterBar;