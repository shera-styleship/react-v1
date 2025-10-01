const getStringedDate = (targetDate)=>{
    /*// 날짜 -> YYYY-MM-DD
    let year = targetDate.getFullYear();
    let month = targetDate.getMonth() + 1;
    let date = targetDate.getDate();

    // 달이나 일이 10 이하의 값이라면 두자리 숫자가 아니기 때문에 MM-DD 형식에 안 맞음.
    if (month < 10){
        month = `0${month}`;
    }
    if (date < 10){
        date = `0${date}`;
    }

    return `${year}-${month}-${date}`;*/

    return new Date(targetDate).toLocaleDateString("en-CA");

}
export default getStringedDate;