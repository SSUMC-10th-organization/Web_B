import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { uploadImage } from "../apis/auth";
import { createLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

type LpCreateModalProps = {
	onClose: () => void;
};

const LpCreateModal = ({ onClose }: LpCreateModalProps) => {
	const queryClient = useQueryClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [thumbnail, setThumbnail] = useState("");
	const [thumbnailPreview, setThumbnailPreview] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);

	const { mutate: uploadImg, isPending: isUploading } = useMutation({
		mutationFn: (file: File) => uploadImage(file),
		onSuccess: ({ data }) => {
			setThumbnail(data.imageUrl);
			setThumbnailPreview(data.imageUrl);
		},
	});

	const { mutate: submitLp, isPending: isSubmitting } = useMutation({
		mutationFn: () =>
			createLp({ title, content, thumbnail, tags, published: true }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
			onClose();
		},
		onError: () => {
			alert("LP 생성에 실패했습니다.");
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				setThumbnailPreview(ev.target?.result as string);
			};
			reader.readAsDataURL(file);
			uploadImg(file);
		}
	};

	const handleAddTag = () => {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) {
			setTags((prev) => [...prev, trimmed]);
		}
		setTagInput("");
	};

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	const isDisabled =
		!title.trim() || !content.trim() || isSubmitting || isUploading;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* 백드롭 */}
			<button
				type="button"
				aria-label="모달 닫기"
				className="absolute inset-0 w-full h-full bg-black/70 cursor-default"
				onClick={onClose}
			/>

			{/* 모달 본체 */}
			<div className="relative bg-[#1e1e1e] rounded-2xl w-full max-w-md mx-4 p-6 z-10">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
				>
					✕
				</button>

				<div className="flex justify-center mb-6">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center hover:opacity-80 transition-opacity"
					>
						{thumbnailPreview ? (
							<img
								src={thumbnailPreview}
								alt="thumbnail"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="flex flex-col items-center gap-1 text-gray-400">
								<span className="text-3xl">🎵</span>
								<span className="text-xs">사진 추가</span>
							</div>
						)}
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				<div className="flex flex-col gap-3">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="LP Name"
						className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e91e8c]"
					/>
					<input
						type="text"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="LP Content"
						className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e91e8c]"
					/>

					<div className="flex gap-2">
						<input
							type="text"
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddTag();
								}
							}}
							placeholder="LP Tag"
							className="flex-1 bg-[#2a2a2a] text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e91e8c]"
						/>
						<button
							type="button"
							onClick={handleAddTag}
							className="px-4 py-2 bg-[#e91e8c] text-white text-sm rounded hover:bg-[#c2185b] transition-colors"
						>
							Add
						</button>
					</div>

					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded-full"
								>
									{tag}
									<button
										type="button"
										onClick={() => handleRemoveTag(tag)}
										className="text-gray-400 hover:text-white ml-1"
									>
										×
									</button>
								</span>
							))}
						</div>
					)}

					<button
						type="button"
						onClick={() => submitLp()}
						disabled={isDisabled}
						className="w-full py-2 bg-[#e91e8c] text-white rounded font-medium hover:bg-[#c2185b] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed mt-2"
					>
						{isSubmitting ? "등록 중..." : "Add LP"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LpCreateModal;
