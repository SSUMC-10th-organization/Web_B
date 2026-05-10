import { useState, useEffect, useRef } from "react";
import { useLpMutation } from "../hooks/mutations/useLpMutations";
import { QUERY_KEY } from "../constants/key";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../apis/axiosInstance"; // ✅ api 임포트 확인

interface CreateLpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_LP_IMAGE = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22shine%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23111%22%2F%3E%3Cstop%20offset%3D%2245%25%22%20stop-color%3D%22%23555%22%2F%3E%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23fff%22%20stop-opacity%3D%220.3%22%2F%3E%3Cstop%20offset%3D%2255%25%22%20stop-color%3D%22%23555%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23111%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22190%22%20fill%3D%22url(%23shine)%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22170%22%20fill%3D%22none%22%20stroke%3D%22%23111%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22150%22%20fill%3D%22none%22%20stroke%3D%22%23222%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22130%22%20fill%3D%22none%22%20stroke%3D%22%23111%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%22110%22%20fill%3D%22none%22%20stroke%3D%22%23222%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%2290%22%20fill%3D%22none%22%20stroke%3D%22%23111%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%2265%22%20fill%3D%22%23d94b2b%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%2260%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%228%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22200%22%20r%3D%227%22%20fill%3D%22%232d2f36%22%2F%3E%3C%2Fsvg%3E";

export const CreateLpModal = ({ isOpen, onClose }: CreateLpModalProps) => {
    const [lpName, setLpName] = useState("");
    const [lpContent, setLpContent] = useState("");
    const [currentTag, setCurrentTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    
    const [previewImage, setPreviewImage] = useState(DEFAULT_LP_IMAGE);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false); // ✅ 이미지 업로드 상태 추가
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { createLp } = useLpMutation();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isOpen) {
            setLpName("");
            setLpContent("");
            setTags([]);
            setCurrentTag("");
            setPreviewImage(DEFAULT_LP_IMAGE);
            setImageFile(null);
            setIsUploading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag("");
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleAddLpSubmit = async () => {
        if (!lpName.trim() || !lpContent.trim() || !imageFile) {
            alert("LP 정보와 사진을 모두 등록해주세요.");
            return;
        }

        try {
            setIsUploading(true); // 로딩 시작

            // 1️⃣ 이미지 파일을 서버에 먼저 업로드해서 진짜 URL 받아오기
            const formData = new FormData();
            formData.append("file", imageFile);

            const uploadRes = await api.post("/v1/uploads", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const realImageUrl = uploadRes.data.data.imageUrl; // 서버에서 준 진짜 URL

            // 2️⃣ 받아온 진짜 URL을 포함해서 LP 등록 페이로드 구성
            const payload = {
                title: lpName,
                content: lpContent,
                thumbnail: realImageUrl, // ✅ 이제 임시 주소가 아닌 진짜 주소 전송
                tags: tags,
                published: true
            };

            // 3️⃣ LP 생성 API 호출
            createLp.mutate(payload, {
                onSuccess: () => {
                    queryClient.resetQueries({ queryKey: [QUERY_KEY.lps] });
                    onClose(); 
                },
                onSettled: () => {
                    setIsUploading(false); // 성공/실패 여부와 상관없이 로딩 종료
                }
            });
        } catch (error) {
            console.error("이미지 업로드 중 오류 발생:", error);
            alert("이미지 업로드에 실패했습니다.");
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <button 
                type="button"
                aria-label="배경"
                className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default outline-none" 
                onClick={onClose}
            ></button>

            <div className="relative bg-[#2d2f36] w-[420px] p-8 rounded-2xl flex flex-col items-center gap-6 shadow-2xl border border-zinc-700 animate-in fade-in zoom-in duration-200">
                
                <button type="button"
                    onClick={onClose}
                    className="absolute top-4 right-6 text-zinc-400 hover:text-white text-2xl transition-colors"
                >
                    &times;
                </button>

                <button 
                    type="button"
                    aria-label="LP 이미지 업로드"
                    className="w-40 h-40 rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-zinc-800 bg-black flex items-center justify-center cursor-pointer group relative"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <img 
                        src={previewImage} 
                        alt="LP Preview" 
                        className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute opacity-0 group-hover:opacity-100 text-white text-[10px] font-bold pointer-events-none">
                        PHOTO UPLOAD
                    </div>
                </button>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                />

                <div className="w-full flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="LP Name"
                        value={lpName}
                        onChange={(e) => setLpName(e.target.value)}
                        className="w-full bg-[#3a3d46] border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <input
                        type="text"
                        placeholder="LP Content"
                        value={lpContent}
                        onChange={(e) => setLpContent(e.target.value)}
                        className="w-full bg-[#3a3d46] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="LP Tag"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            className="flex-1 bg-[#3a3d46] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                        <button 
                            type="button"
                            onClick={handleAddTag}
                            className="bg-zinc-400 hover:bg-zinc-300 text-[#2d2f36] font-bold px-4 py-2 rounded-lg transition-colors active:scale-95"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1 min-h-[32px]">
                        {tags.map((tag) => (
                            <span 
                                key={tag} 
                                className="flex items-center gap-1 text-[11px] bg-purple-600/30 text-purple-400 px-2 py-1 rounded-md border border-purple-500/50 animate-in slide-in-from-left-1 duration-150"
                            >
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteTag(tag)}
                                    className="hover:text-red-400 transition-colors font-bold ml-1"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <button 
                    type="button" 
                    onClick={handleAddLpSubmit}
                    disabled={createLp.isPending || isUploading}
                    className={`w-full font-extrabold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                        createLp.isPending || isUploading ? "bg-zinc-600 cursor-not-allowed text-zinc-400" : "bg-[#a9b0c0] hover:bg-white text-[#2d2f36]"
                    }`}
                >
                    {createLp.isPending || isUploading ? "Uploading..." : "Add LP"}
                </button>
            </div>
        </div>
    );
};