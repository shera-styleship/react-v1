import './App.css';

import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import { useState, useRef, useReducer, createContext } from 'react';

import Home from './pages/Home';
import Project from './pages/Project';
import MyProject from './pages/MyProject';
import Schedule from './pages/Schedule';
import Knowledge from './pages/Knowledge';
import Hr from './pages/Hr';
import Setting from './pages/Setting';
import Login from './pages/Login';

function reducer(state, action) {
	switch (action.type) {
		case 'CREATE':
			// 뒤에 붙이려면 [...state, action.data], 앞에 붙이려면 [action.data, ...state]
			return [...state, action.data];
		case 'UPDATE':
			// user라는 인수를 주고, 해당 user의 id값이 수정한 데이터의 id 값과 일치한다면 수정한 데이터를 반환하고 아니면 기존 데이터를 반환
			return state.map((user) => (String(user.id) === String(action.data.id) ? action.data : user));
		case 'DELETE':
			return state.filter((user) => String(user.id) !== String(action.id));

		default:
			return state;
	}
}

const initialUserData = [
	{
		id: 0,
		userId: 'test01',
		userPassword: '1234',
		userName: '홍길동',
		userImage: '/images/profile01.jpg',
		userPhone: '010-0000-0000',
		userCompany: 'NEPA',
	},
	{
		id: 1,
		userId: 'test02',
		userPassword: '5678',
		userName: '안태리',
		userImage: '/images/profile02.jpg',
		userPhone: '010-1234-5678',
		userCompany: 'Styleship',
	},
	{
		id: 2,
		userId: 'test03',
		userPassword: '2580',
		userName: '임꺽정',
		userImage: '/images/profile03.jpg',
		userPhone: '010-0000-0000',
		userCompany: 'FILA',
	},
];

export const UserDataContext = createContext();
export const UserDispatchContext = createContext();

function App() {
	const idRef = useRef(3);
	const [userData, dispatch] = useReducer(reducer, initialUserData);
	const [auth, setAuth] = useState({ isLoggedIn: false, userId: null });
	const [alertState, setAlertState] = useState('');
	const handleAlertBtn = () => {
		if (alertState === 'on') {
			setAlertState('');
		} else {
			setAlertState('on');
		}
	};

	const onCreate = (user) => {
		dispatch({
			type: 'CREATE',
			data: {
				id: idRef.current++,
				...user,
			},
		});
	};

	const onUpdate = (id, patch) => {
		const original = userData.find((user) => String(user.id) === String(id));
		if (!original) return;
		dispatch({
			type: 'UPDATE',
			data: { ...original, ...patch, id },
		});
	};

	const login = (id) => {
		// 호출시 auth를 해당 인수로 바꿔줌 = 로그인됨+로그인한 사람의 id 저장
		setAuth({ isLoggedIn: true, userId: id });
	};
	const logout = () => {
		// 호출시 auth를 해당 인수로 바꿔줌 = 초기화해서 로그아웃상태로 되돌림
		setAuth({ isLoggedIn: false, userId: null });
	};
	return (
		<>
			<UserDataContext.Provider value={{ userData, auth, alertState, handleAlertBtn }}>
				<UserDispatchContext.Provider value={{ onCreate, login, logout, onUpdate }}>
					<Routes>
						{/* 로그인 전용 레이아웃 */}
						<Route element={<AuthLayout />}>
							<Route path='/login' element={<Login />} />
						</Route>
						{/* //로그인 전용 레이아웃 */}

						{/* 공용 레이아웃 */}
						<Route element={<AppLayout />}>
							<Route path='/' element={<Home />} />
							<Route path='/Project' element={<Project />} />
							<Route path='/MyProject' element={<MyProject />} />
							<Route path='/Schedule' element={<Schedule />} />
							<Route path='/Knowledge' element={<Knowledge />} />
							<Route path='/Hr' element={<Hr />} />
							<Route path='/Setting' element={<Setting />} />
						</Route>
						{/* //공용 레이아웃 */}
					</Routes>
				</UserDispatchContext.Provider>
			</UserDataContext.Provider>
		</>
	);
}

export default App;
