const Button = ({ children, onClick, btnSize, btnChar, btnType = 'button' }) => {
	return (
		<>
			<button type={btnType} onClick={onClick} className={`Button Button_${btnSize} Button_${btnChar}`}>
				{children}
			</button>
		</>
	);
};
export default Button;

// Props
// 1. children: 버튼 안에 들어갈 글자
// 2. onClick: 클릭했을때의 이벤트 함수
// 3. btnSize: 버튼 사이즈 -> small, middle, big
// 4. btnChar: 버튼 색 -> orange, white
