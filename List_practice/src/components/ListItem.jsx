import './ListItem.css'
import getStringedDate from '../util/get-stringed-date';

const ListItem = ({item, onClick})=>{
    return (
        <div className="ListItem" onClick={onClick}>
            <div className='text_box'>
                <p className="num">{item.id}</p>
                <p className="tit">{item.projectTitle}</p>
                <p className="date">{getStringedDate(item.createdDate)}</p>
            </div>
        </div>
    )
}
export default ListItem;