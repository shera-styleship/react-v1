import './List.css'
import ListItem from './ListItem';
import Button from './Button';
import { useState } from 'react';

const List = ({data, onSelect, onNew})=>{
    const [sortType, setSortType] = useState('latest');

    const onChangeSortType = (e)=>{
        setSortType(e.target.value);
    }

    const getSortedData = ()=>{
        return data.toSorted((a, b)=>{
            if(sortType === 'oldest'){
                return Number(a.createdDate) - Number(b.createdDate);
            } else {
                return Number(b.createdDate) - Number(a.createdDate)
            }
        });
    }
    const sortedData = getSortedData();

    return (
        <div className="List">

            <div className="list_btn_box">
                <div>
                    <select name="" id="" onChange={onChangeSortType}>
                        <option value="latest">최신순</option>
                        <option value="oldest">오래된순</option>
                    </select>

                    <Button text={"새 프로젝트 작성"} onClick={onNew} type={'NEW'}/>
                </div>
            </div>

            <div className="list_item_box">
                {sortedData.map((item)=>
                    <ListItem 
                        key={item.id} 
                        item={item} 
                        onClick={()=>onSelect(item.id)}
                    />
                )}
            </div>
            
        </div>
    )
}
export default List;