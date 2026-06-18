import { useState } from "react";

interface Props {
	onComplete: (nickname: string) => void;
}

function ProfileStep({ onComplete }: Props) {
	const [nickname, setNickname] = useState("");

	const isValid = nickname.trim().length > 0;

	return (
		<div className="flex flex-col gap-4">
			<p className="text-gray-400 text-sm">프로필을 설정해주세요.</p>

			{/* 프로필 이미지 UI (기능 없음, UI만) */}
			<div className="flex justify-center">
				<div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-gray-400 cursor-pointer hover:bg-gray-600 transition">
					📷
				</div>
			</div>

			{/* 닉네임 입력 */}
			<div className="flex flex-col gap-1">
				<input
					type="text"
					placeholder="닉네임을 입력해주세요!"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
				/>
				{nickname.length === 0 && (
					<p className="text-gray-500 text-sm">
						닉네임은 필수 입력 항목입니다.
					</p>
				)}
			</div>

			<button
				type="button"
				onClick={() => onComplete(nickname)}
				disabled={!isValid}
				className={`w-full py-3 rounded-md text-base font-medium transition ${
					isValid
						? "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
						: "bg-gray-800 text-gray-500 cursor-not-allowed"
				}`}
			>
				회원가입 완료
			</button>
		</div>
	);
}

export default ProfileStep;
