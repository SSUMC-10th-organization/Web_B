import { useRef, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import useUpdateMyInfo from "../hooks/useUpdateMyInfo";

export const MyPage = () => {
  const { accessToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isPending } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const { mutate: updateMyInfo, isPending: isUpdating } = useUpdateMyInfo();

  const handleEditOpen = () => {
    setNameInput(data?.data?.name ?? "");
    setBioInput(data?.data?.bio ?? "");
    setAvatarPreview(data?.data?.avatar ?? "");
    setAvatarUrl(data?.data?.avatar ?? "");
    setIsEditing(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!nameInput.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    updateMyInfo(
      {
        name: nameInput,
        bio: bioInput || undefined,
        avatar: avatarUrl || undefined,
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  if (isPending) {
    return (
      <div className="p-6 w-full max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mx-auto" />
      </div>
    );
  }

  const myData = data?.data;

  return (
    <div className="p-6 w-full max-w-md mx-auto">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* 아바타 */}
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {myData?.avatar ? (
            <img
              src={myData.avatar}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-2xl">{myData?.name?.[0]}</span>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold">{myData?.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{myData?.email}</p>
          {myData?.bio && (
            <p className="text-sm text-gray-500 mt-2">{myData.bio}</p>
          )}
        </div>

        {/* 설정 버튼 */}
        <button
          onClick={handleEditOpen}
          className="px-4 py-2 text-sm border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
        >
          ⚙ 설정
        </button>
      </div>

      {/* 수정 모달 */}
      {isEditing && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-xl w-[360px] p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">프로필 수정</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 아바타 수정 */}
            <div
              className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mx-auto cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">사진 선택</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 이름 */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">이름 *</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="이름을 입력해주세요."
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Bio (선택)</label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-black transition-colors"
                placeholder="자기소개를 입력해주세요."
                rows={3}
              />
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={isUpdating || !nameInput.trim()}
              className="w-full py-2.5 text-sm bg-black text-white rounded-md hover:bg-[#333] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
