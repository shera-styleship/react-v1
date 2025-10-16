const FileTask = ()=>{
    return (
        <div className="FileTask">
            <div className="file-list">
                <div>
                    <p className="date-indicator">2025-10-15 수요일</p>

                    <div className="wrap">
                        <div class="file">
                            <div class="info-box">
                                <p class="user-name">장길산</p>
                                <p className="time">오후 4:43</p>
                            </div>
                            <div class="down-box">
                                <p>250818_수정사항.jpg</p>
                            </div>
                        </div>

                        <div class="file">
                            <div class="info-box">
                                <p class="user-name">장길산</p>
                                <p className="time">오후 4:43</p>
                            </div>
                            <div class="down-box">
                                <p>250818_수정사항.jpg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="file-input">
                <p className="file-name"></p>
                <button type="button" className="file-upload__btn">파일첨부</button>
            </div>
        </div>
    )
}
export default FileTask;