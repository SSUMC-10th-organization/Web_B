import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../apis/lp";

interface LpCardProps {
	lp: Lp;
}

// [최적화 1] memo: 부모(HomePage)가 showModal 상태 변경으로 리렌더될 때
// lp props가 바뀌지 않은 카드들은 리렌더를 건너뜀
const LpCard = memo(function LpCard({ lp }: LpCardProps) {
	const navigate = useNavigate();

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: 카드 전체를 클릭 가능한 영역으로 사용
		// biome-ignore lint/a11y/noStaticElementInteractions: 카드 전체를 클릭 가능한 영역으로 사용
		<div
			onClick={() => navigate(`/lp/${lp.id}`)}
			className="relative rounded-[10px] overflow-hidden cursor-pointer aspect-square bg-gray-800 group transition-transform duration-200 ease-in-out hover:scale-[1.04] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
		>
			<img
				src={lp.thumbnail}
				alt={lp.title}
				className="w-full h-full object-cover block"
			/>

			{/* hover 오버레이 */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-1">
				<div className="font-bold text-[0.95rem] text-white overflow-hidden text-ellipsis whitespace-nowrap">
					{lp.title}
				</div>
				<div className="text-[0.78rem] text-gray-300">
					{lp.createdAt?.slice(0, 10)}
				</div>
				<div className="text-[0.78rem] text-pink-300">
					❤️ {lp.likes?.length ?? 0}
				</div>
			</div>

			{/* 기본 하단 정보 (hover 아닐 때) */}
			<div className="absolute bottom-0 left-0 right-0 px-[0.6rem] py-2 bg-gradient-to-t from-black/70 to-transparent text-white text-[0.78rem] group-hover:hidden">
				<div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
					{lp.title}
				</div>
				<div className="opacity-75">{lp.createdAt?.slice(0, 10)}</div>
			</div>
		</div>
	);
});

export default LpCard;
