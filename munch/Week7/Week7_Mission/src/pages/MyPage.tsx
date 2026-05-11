import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getMyInfo, updateUser, uploadImage } from "../apis/auth";
import { ErrorFallback, LoadingSpinner } from "../components/CommonStates";
import { toast } from "../components/Toast";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const {
    data: myInfo,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    select: (res: ResponseMyInfoDto) => res.data,
  });

  const { mutate: uploadImg } = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onSuccess: ({ data }) => {
      setAvatarUrl(data.imageUrl);
      setAvatarPreview(data.imageUrl);
    },
    onError: () => {
      toast.error("이미지 업로드에 실패했습니다.");
    },
  });

  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updateUser({
        name,
        bio: bio || undefined,
        avatar: avatarUrl || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      toast.success("프로필이 수정되었습니다.");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("수정에 실패했습니다.");
    },
  });

  const handleEditStart = () => {
    setName(myInfo?.name ?? "");
    setBio(myInfo?.bio ?? "");
    setAvatarPreview(myInfo?.avatar ?? "");
    setAvatarUrl(myInfo?.avatar ?? "");
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
      uploadImg(file);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorFallback onRetry={refetch} />;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center gap-6">
        {/* 아바타 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center ${
              isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"
            }`}
          >
            {(isEditing ? avatarPreview : myInfo?.avatar) ? (
              <img
                src={isEditing ? avatarPreview : (myInfo?.avatar ?? "")}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">👤</span>
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

        {isEditing ? (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-black text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e91e8c]"
              />
              <button
                type="button"
                onClick={() => submitUpdate()}
                disabled={!name.trim() || isUpdating}
                className="text-white hover:text-[#e91e8c] transition-colors disabled:text-gray-600"
              >
                ✓
              </button>
            </div>
            {/* bio - 옵션이므로 비워도 저장 가능 */}
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio (선택사항)"
              className="w-full bg-black text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e91e8c]"
            />
            <p className="text-gray-400 text-sm text-center">{myInfo?.email}</p>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-500 hover:text-white text-center mt-1"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{myInfo?.name}</h2>
              <button
                type="button"
                onClick={handleEditStart}
                className="text-gray-400 hover:text-white transition-colors text-sm"
                aria-label="설정"
              >
                ⚙️
              </button>
            </div>
            {myInfo?.bio && (
              <p className="text-gray-400 text-sm">{myInfo.bio}</p>
            )}
            <p className="text-gray-500 text-sm">{myInfo?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
