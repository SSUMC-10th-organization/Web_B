import { useRef, useState, type ChangeEvent } from "react";
import useCreateLp from "../hooks/useCreateLp";
import { uploadImage } from "../apis/upload";
import { useAuth } from "../context/AuthContext";

interface LpFormModalProps {
  onClose: () => void;
}

export const LpFormModal = ({ onClose }: LpFormModalProps) => {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createLp, isPending } = useCreateLp();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기는 FileReader로 즉시 표시
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 실제 업로드는 서버로
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setThumbnail(imageUrl);
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      setPreviewUrl("");
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

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    createLp(
      {
        title,
        content,
        thumbnail,
        tags,
        published: true,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-xl w-[360px] p-6 flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {/* 썸네일 미리보기 */}
        <div
          className="w-36 h-36 mx-auto rounded-full overflow-hidden bg-[#333] flex items-center justify-center cursor-pointer relative"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="썸네일 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">사진 선택</span>
          )}
          {/* 업로드 중 오버레이 */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs">업로드 중...</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* LP Name */}
        <input
          type="text"
          placeholder="LP Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
        />

        {/* LP Content */}
        <input
          type="text"
          placeholder="LP Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
        />

        {/* LP Tag */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            className="flex-1 bg-[#2a2a2a] text-white text-sm rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2.5 text-sm bg-[#2a2a2a] text-white rounded-md hover:bg-[#333] transition-colors"
          >
            Add
          </button>
        </div>

        {/* 태그 목록 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#333] text-gray-300 rounded-full"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add LP 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={
            isPending || isUploading || !title.trim() || !content.trim()
          }
          className="w-full py-2.5 text-sm bg-[#555] text-white rounded-md hover:bg-[#666] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "작성 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};
