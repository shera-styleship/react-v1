import { useState } from "react";
import Select from "@components/common/Select";
import Input from "@components/common/Input";
import {filterBarOptions} from "@config/filterBarOptions"

const ProjectFilterBar = ({ filters, setFilters, onFilter }) => {
  const handleSelect = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleKeywordSearch = () => {
    onFilter(filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleKeywordSearch();
  };

  const handleStatus = (type) => {
    const newFilters = { ...filters, status: type };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 날짜 필터는 조회 버튼 눌러야 반영
  const handleDateSearch = () => {
    onFilter(filters, true);
  };

  return (
    <div className="ProjectFilterBar">
      <div>
        <div className="select-box">
          {filterBarOptions.map(({ name, options }) => (
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
            setValue={(val) =>
              setFilters((prev) => ({ ...prev, keyword: val }))
            }
            onKeyDown={handleKeyPress}
          />
          <button
            type="button"
            className="pj-search__btn"
            onClick={handleKeywordSearch}
          ></button>
        </div>
      </div>

      <div className="">
        <div className="status-box">
          <button
            type="button"
            className={filters.status === "active" ? "on" : ""}
            onClick={() => handleStatus("active")}
          >
            접수/진행 프로젝트
          </button>
          <button
            type="button"
            className={filters.status === "done" ? "on" : ""}
            onClick={() => handleStatus("done")}
          >
            완료/취소 프로젝트
          </button>
        </div>
        <div className="date-box">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
          />
          ~
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
          />
          <button
            type="button"
            className="pj-date__btn"
            onClick={handleDateSearch}
          >
            조회
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilterBar;
