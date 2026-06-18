import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { createLp, uploadImage } from "../apis/lp";

type Props = {
	onClose: () => void;
};

export default function AddLpModal({ onClose }: Props) {
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
	const [isUploading, setIsUploading] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const { mutate, isPending } = useMutation({
		mutationFn: createLp,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lps"] });
			onClose();
		},
		onError: (err: unknown) => {
			const msg =
				err instanceof Error ? err.message : "LP 추가에 실패했습니다.";
			setSubmitError(msg);
			console.error("[AddLP error]", err);
		},
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPreviewUrl(URL.createObjectURL(file));
		setIsUploading(true);
		try {
			const imageUrl = await uploadImage(file);
			setThumbnail(imageUrl);
		} catch {
			setSubmitError("이미지 업로드에 실패했습니다.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleAddTag = () => {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) {
			setTags((prev) => [...prev, trimmed]);
		}
		setTagInput("");
	};

	const handleSubmit = () => {
		if (!title.trim() || tags.length === 0) return;
		mutate({ title, content, thumbnail, published: true, tags });
	};

	const isSubmittable = !!title.trim() && tags.length > 0 && !isUploading;

	const inputClass =
		"bg-[#2c2c2e] border border-[#3a3a3c] rounded-lg text-white px-4 py-3 text-[0.95rem] outline-none w-full";

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: 모달 오버레이 클릭으로 닫기
		// biome-ignore lint/a11y/useKeyWithClickEvents: 모달 오버레이 클릭으로 닫기
		<div
			className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000"
			onClick={onClose}
		>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: 이벤트 버블링 방지 */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: 이벤트 버블링 방지 */}
			<div
				className="bg-[#1c1c1e] rounded-2xl p-8 w-full max-w-95 relative flex flex-col gap-4"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 닫기 버튼 */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 bg-transparent border-0 text-white text-xl cursor-pointer leading-none"
				>
					✕
				</button>

				{/* LP 이미지 (클릭 시 파일 선택) */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: 파일 선택 트리거 */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: 파일 선택 트리거 */}
				<div
					className={`flex justify-center relative ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
					onClick={() => !isUploading && fileInputRef.current?.click()}
				>
					{previewUrl ? (
						<div className="relative w-50 h-50">
							<img
								src={previewUrl}
								alt="LP thumbnail"
								className={`w-50 h-50 rounded-full object-cover ${isUploading ? "opacity-50" : "opacity-100"}`}
							/>
							{isUploading && (
								<div className="absolute inset-0 flex items-center justify-center text-white text-[0.85rem]">
									업로드 중...
								</div>
							)}
						</div>
					) : (
						<div
							className="w-50 h-50 rounded-full"
							style={{
								background:
									"radial-gradient(circle, #888 0%, #888 8%, #111 8%, #111 38%, #1a1a1a 38%, #1a1a1a 41%, #111 41%)",
								boxShadow: "0 0 0 1px #444",
							}}
						/>
					)}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				{/* LP Name */}
				<input
					type="text"
					placeholder="LP Name"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className={inputClass}
				/>

				{/* LP Content */}
				<input
					type="text"
					placeholder="LP Content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className={inputClass}
				/>

				{/* LP Tag 입력 */}
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="LP Tag"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
						className="bg-[#2c2c2e] border border-[#3a3a3c] rounded-lg text-white px-4 py-3 text-[0.95rem] outline-none flex-1 min-w-0"
					/>
					<button
						type="button"
						onClick={handleAddTag}
						className="bg-[#3a3a3c] border-0 rounded-lg text-white px-[1.1rem] py-3 cursor-pointer font-bold whitespace-nowrap"
					>
						Add
					</button>
				</div>

				{/* 태그 목록 */}
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<span
								key={tag}
								className="bg-[#2c2c2e] border border-[#3a3a3c] rounded-full text-white px-3 py-[0.3rem] text-[0.85rem] flex items-center gap-[0.4rem]"
							>
								{tag}
								<button
									type="button"
									onClick={() =>
										setTags((prev) => prev.filter((t) => t !== tag))
									}
									className="bg-transparent border-0 text-[#aaa] cursor-pointer text-[0.8rem] p-0 leading-none"
								>
									✕
								</button>
							</span>
						))}
					</div>
				)}

				{/* 에러 메시지 */}
				{submitError && (
					<p className="text-red-400 text-[0.85rem] m-0">{submitError}</p>
				)}

				{/* Add LP 버튼 */}
				<button
					type="button"
					onClick={handleSubmit}
					disabled={
						isPending || isUploading || !title.trim() || tags.length === 0
					}
					className={`border-0 rounded-lg text-white py-[0.9rem] text-base font-bold mt-1 transition-colors ${
						isSubmittable
							? "bg-pink-500 cursor-pointer"
							: "bg-[#3a3a3c] cursor-not-allowed"
					}`}
				>
					{isPending ? "추가 중..." : "Add LP"}
				</button>
			</div>
		</div>
	);
}
