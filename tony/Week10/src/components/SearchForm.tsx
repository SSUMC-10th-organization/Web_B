import { memo, useCallback } from "react";
import type { Language, SearchParams } from "../types/movie";

interface SearchFormProps {
	params: SearchParams;
	onChange: (params: SearchParams) => void;
	onSubmit: () => void;
}

// memo: 부모가 리렌더돼도 params, onChange, onSubmit 참조가 같으면 리렌더 안 함
const SearchForm = memo(function SearchForm({
	params,
	onChange,
	onSubmit,
}: SearchFormProps) {
	// useCallback: onChange가 매번 새 참조가 되지 않도록 내부에서 안정화
	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange({ ...params, query: e.target.value });
		},
		[onChange, params],
	);

	const handleAdultChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange({ ...params, includeAdult: e.target.checked });
		},
		[onChange, params],
	);

	const handleLanguageChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			onChange({ ...params, language: e.target.value as Language });
		},
		[onChange, params],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			onSubmit();
		},
		[onSubmit],
	);

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 bg-gray-900 rounded-2xl p-6 mb-8"
		>
			{/* 영화 제목 입력 */}
			<div className="flex flex-col gap-1">
				<label className="text-sm text-gray-400 font-medium">영화 제목</label>
				<input
					type="text"
					value={params.query}
					onChange={handleTitleChange}
					placeholder="영화 제목을 입력하세요"
					className="bg-gray-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
				/>
			</div>

			<div className="flex items-center gap-6 flex-wrap">
				{/* 성인 콘텐츠 체크박스 */}
				<label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 select-none">
					<input
						type="checkbox"
						checked={params.includeAdult}
						onChange={handleAdultChange}
						className="w-4 h-4 accent-purple-500 cursor-pointer"
					/>
					성인 콘텐츠 포함
				</label>

				{/* 언어 선택 */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-400">언어</span>
					<select
						value={params.language}
						onChange={handleLanguageChange}
						className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
					>
						<option value="ko-KR">한국어</option>
						<option value="en-US">영어</option>
						<option value="ja-JP">일본어</option>
					</select>
				</div>

				{/* 검색 버튼 */}
				<button
					type="submit"
					className="ml-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
				>
					검색
				</button>
			</div>
		</form>
	);
});

export default SearchForm;
