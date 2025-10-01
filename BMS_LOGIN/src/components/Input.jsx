import { useState } from 'react';
const Input = ({
	inputType = 'text',
	inputPlaceholder,
	inputValue,
	inputLabel,
	setValue,
	inputChar,
	toggleVisibility = false,
	inputAble = true,
}) => {
	// 패스워드 보여줄까 말까 하는 부분의 기본값 false(안보여줌)
	const [showPw, setShowPw] = useState(false);

	// input type이 password인지 확인
	const isPassword = inputType === 'password';

	// input type이 password이고, toggleVisibility의 값이 true인 경우 showPw가 true이면 text, false(기본값)면 password
	// 근데 input type이 password가 아니거나, toggleVisibility의 값이 false로 설정된 input의 경우에는 그냥 inputType값 반환
	const effectiveType = isPassword && toggleVisibility ? (showPw ? 'text' : 'password') : inputType;

	const isFile = inputType === 'file';
	const handleChange = (e) => {
		if (isFile) {
			// 파일 업로드일 경우
			const file = e.target.files[0] || null;
			setValue?.(file); // 부모 state에 파일 객체 저장
		} else {
			// 일반 텍스트 입력일 경우
			setValue(e.target.value);
		}
	};

	return (
		<>
			{/* 라벨 있으면 라벨 노출시키고 없으면 비노출 */}
			<label className='input_label_wrap'>
				{inputLabel ? inputLabel : ''}

				<input
					type={effectiveType}
					placeholder={inputPlaceholder}
					value={inputValue}
					onChange={handleChange}
					className={`Input Input_${inputChar}`}
					disabled={!inputAble}
				/>
				{isPassword && toggleVisibility && (
					<button
						type='button'
						className='Input_toggle'
						// 누를때마다 현재값의 반대값을 반환
						onClick={() => setShowPw((cur) => !cur)}
						aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
						aria-pressed={showPw}
					>
						{showPw ? <img src='/images/invisible.png' alt='안보임' /> : <img src='/images/visible.png' alt='안보임' />}
					</button>
				)}
			</label>
		</>
	);
};

export default Input;

// props
// 1. inputType(text가 기본값) : input의 type을 뭘로 할건지
// 2. inputPlaceholder : input의 placeholder
// 3. inputValue : input에 저장할 value
// 4. inputLabel : input 라벨명
// 5. setValue : input에 입력받을 값이 들어갈 state의 setState
// 6. inputChar: input 어디다 쓸건지 -> login, join 등.. 디자인이 다를 경우를 대비
// 7. toggleVisibility: 비밀번호 토글
