import '@components/feature/TeamSorting.css';
import Checkbox from '@components/common/Checkbox';
import Button from '@components/common/Button';
import { createPortal } from 'react-dom';
import { UserDataContext } from '@/App';
import { useEffect, useMemo, useState, useContext } from 'react';
import { API_BASE } from '@/utils/env';

const TEAM_OPTIONS = [
	{ value: 'SR', label: 'SR' },
	{ value: 'CR1', label: 'CR1' },
	{ value: 'CR2', label: 'CR2' },
	{ value: 'UI', label: 'UI' },
	{ value: '스마트라이즈', label: '스마트라이즈' },
];

const parseWorkTeam = (v) => {
	if (!v) return [];

	if (Array.isArray(v)) return v.filter(Boolean);

	if (typeof v !== 'string') return [String(v)].filter(Boolean);

	let s = v;

	for (let i = 0; i < 2; i++) {
		try {
			const parsed = JSON.parse(s);
			if (Array.isArray(parsed)) return parsed.filter(Boolean);
			if (typeof parsed === 'string') s = parsed;
			else break;
		} catch {
			break;
		}
	}

	try {
		const parsed2 = JSON.parse(s);
		if (Array.isArray(parsed2)) return parsed2.filter(Boolean);
		if (typeof parsed2 === 'string') return [parsed2].filter(Boolean);
	} catch {}

	if (s.includes(',')) {
		return s
			.split(',')
			.map((x) => x.trim())
			.filter(Boolean);
	}

	return [s.replace(/\\?"/g, '')].filter(Boolean);
};

// ✅ DB에 "\"[...]"\"" 형태(이중 stringify)로 저장해야 기존 패턴 유지 가능
const serializeWorkTeam = (arr) => JSON.stringify(JSON.stringify(arr));

/**
 * ✅ workTeam을 "위에서" props로 받는 버전
 */
const TeamSorting = ({ onClose, projectTitle, brand, workNo, workTeam, onSaveWorkTeam }) => {
	const [activeTab, setActiveTab] = useState('styleship');
	const { userData, refreshProjects } = useContext(UserDataContext);

	// PATCH용 id
	const [recordId, setRecordId] = useState(workNo ?? null);

	// ✅ 복수 선택
	const [selectedTeams, setSelectedTeams] = useState([]);

	// 필요 없으면 삭제 가능
	const filtered = useMemo(() => {
		if (activeTab === 'styleship') {
			return userData.filter((u) => u.userCompany === 'STYLESHIP');
		}
		return userData.filter((u) => u.userCompany === brand);
	}, [activeTab, brand, userData]);

	const WORK_ENDPOINT = 'workList';

	// ✅ projectId가 바뀌면 recordId도 갱신 (PATCH 대상)
	useEffect(() => {
		setRecordId(workNo ?? null);
	}, [workNo]);

	// ✅ "위에서 내려준" workTeam으로 체크 초기화/동기화
	useEffect(() => {
		setSelectedTeams(parseWorkTeam(workTeam));
	}, [workTeam]);

	// body 스크롤 잠금
	useEffect(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);

	// ✅ 복수 토글
	const toggleTeam = (teamValue) => {
		setSelectedTeams((prev) => (prev.includes(teamValue) ? prev.filter((t) => t !== teamValue) : [...prev, teamValue]));
	};

	const handleSave = async () => {
		// 지금은 로컬 반영만!
		const nextWorkTeam = serializeWorkTeam(selectedTeams); // 기존 데이터 형식 유지: "\"[...]"\""

		onSaveWorkTeam?.(workNo, nextWorkTeam);
		onClose();
	};

	const teamSortingModal = (
		<div className='teamSorting_backdrop' onClick={onClose}>
			<div className='teamSorting_dialog' onClick={(e) => e.stopPropagation()}>
				<div className='teamSorting_title'>
					<p>작업 진행</p>
					<button type='button' className='teamSorting_close' onClick={onClose} aria-label='닫기'></button>
				</div>

				<div className='teamSorting_contents'>
					<dl>
						<dt>브랜드</dt>
						<dd>{brand}</dd>
					</dl>
					<dl>
						<dt>프로젝트 제목</dt>
						<dd>{projectTitle}</dd>
					</dl>
				</div>

				<main className='teamSorting_users'>
					{TEAM_OPTIONS.map((t) => (
						<Checkbox key={t.value} checked={selectedTeams.includes(t.value)} onChange={() => toggleTeam(t.value)}>
							{t.label}
						</Checkbox>
					))}
				</main>

				<div className='teamSorting_footer'>
					<Button btnSize='small' btnChar='white' onClick={onClose}>
						취소
					</Button>
					<Button btnSize='small' btnChar='orange' onClick={handleSave}>
						저장
					</Button>
				</div>
			</div>
		</div>
	);

	return createPortal(teamSortingModal, document.body);
};

export default TeamSorting;
