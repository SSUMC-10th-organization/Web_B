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
		mutate({
			title,
			content,
			thumbnail,
			published: true,
			tags,
		});
	};

	const inputStyle: React.CSSProperties = {
		background: "#2c2c2e",
		border: "1px solid #3a3a3c",
		borderRadius: "8px",
		color: "#fff",
		padding: "0.75rem 1rem",
		fontSize: "0.95rem",
		outline: "none",
		width: "100%",
		boxSizing: "border-box",
	};

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.7)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}
			onClick={onClose}
		>
			<div
				style={{
					background: "#1c1c1e",
					borderRadius: "16px",
					padding: "2rem",
					width: "100%",
					maxWidth: "380px",
					position: "relative",
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* 닫기 버튼 */}
				<button
					type="button"
					onClick={onClose}
					style={{
						position: "absolute",
						top: "1rem",
						right: "1rem",
						background: "none",
						border: "none",
						color: "#fff",
						fontSize: "1.25rem",
						cursor: "pointer",
						lineHeight: 1,
					}}
				>
					✕
				</button>

				{/* LP 이미지 (클릭 시 파일 선택) */}
				<div
					style={{ display: "flex", justifyContent: "center", cursor: isUploading ? "wait" : "pointer", position: "relative" }}
					onClick={() => !isUploading && fileInputRef.current?.click()}
				>
					{previewUrl ? (
						<div style={{ position: "relative", width: "200px", height: "200px" }}>
							<img
								src={previewUrl}
								alt="LP thumbnail"
								style={{
									width: "200px",
									height: "200px",
									borderRadius: "50%",
									objectFit: "cover",
									opacity: isUploading ? 0.5 : 1,
								}}
							/>
							{isUploading && (
								<div style={{
									position: "absolute",
									inset: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#fff",
									fontSize: "0.85rem",
								}}>
									업로드 중...
								</div>
							)}
						</div>
					) : (
						<div
							style={{
								width: "200px",
								height: "200px",
								borderRadius: "50%",
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
						style={{ display: "none" }}
						onChange={handleFileChange}
					/>
				</div>

				{/* LP Name */}
				<input
					type="text"
					placeholder="LP Name"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					style={inputStyle}
				/>

				{/* LP Content */}
				<input
					type="text"
					placeholder="LP Content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					style={inputStyle}
				/>

				{/* LP Tag 입력 */}
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<input
						type="text"
						placeholder="LP Tag"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
						style={{ ...inputStyle, width: "auto", flex: 1 }}
					/>
					<button
						type="button"
						onClick={handleAddTag}
						style={{
							background: "#3a3a3c",
							border: "none",
							borderRadius: "8px",
							color: "#fff",
							padding: "0.75rem 1.1rem",
							cursor: "pointer",
							fontWeight: "bold",
							whiteSpace: "nowrap",
						}}
					>
						Add
					</button>
				</div>

				{/* 태그 목록 */}
				{tags.length > 0 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
						{tags.map((tag) => (
							<span
								key={tag}
								style={{
									background: "#2c2c2e",
									border: "1px solid #3a3a3c",
									borderRadius: "999px",
									color: "#fff",
									padding: "0.3rem 0.75rem",
									fontSize: "0.85rem",
									display: "flex",
									alignItems: "center",
									gap: "0.4rem",
								}}
							>
								{tag}
								<button
									type="button"
									onClick={() =>
										setTags((prev) => prev.filter((t) => t !== tag))
									}
									style={{
										background: "none",
										border: "none",
										color: "#aaa",
										cursor: "pointer",
										fontSize: "0.8rem",
										padding: 0,
										lineHeight: 1,
									}}
								>
									✕
								</button>
							</span>
						))}
					</div>
				)}

				{/* 에러 메시지 */}
				{submitError && (
					<p style={{ color: "#f87171", fontSize: "0.85rem", margin: 0 }}>
						{submitError}
					</p>
				)}

				{/* Add LP 버튼 */}
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isPending || isUploading || !title.trim() || tags.length === 0}
					style={{
						background: title.trim() && tags.length > 0 && !isUploading ? "#ec4899" : "#3a3a3c",
						border: "none",
						borderRadius: "8px",
						color: "#fff",
						padding: "0.9rem",
						fontSize: "1rem",
						fontWeight: "bold",
						cursor: isPending || isUploading || !title.trim() || tags.length === 0 ? "not-allowed" : "pointer",
						marginTop: "0.25rem",
						transition: "background 0.2s",
					}}
				>
					{isPending ? "추가 중..." : "Add LP"}
				</button>
			</div>
		</div>
	);
}
