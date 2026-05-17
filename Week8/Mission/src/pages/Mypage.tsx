import { useEffect, useState } from "react";
import { api } from "../apis/axiosInstance";
import { useUpdateUserMutation } from "../hooks/mutations/useAuthMutation";

type MeResponse = {
  data: {
    id: number;
    email: string;
    name: string;
    bio: string | null;
  };
};

export const MyPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(false);

  const { mutate: updateProfile, isPending } = useUpdateUserMutation();

  useEffect(() => {
    const getMyInfo = async () => {
      const response = await api.get<MeResponse>("/v1/users/me");
      const userData = response.data.data;
      setName(userData.name);
      setEmail(userData.email);
      setBio(userData.bio ?? "");
    };
    getMyInfo();
  }, []);

  // 이름 입력 핸들러: 입력하는 즉시 에러 체크
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // 한 글자라도 입력되면 에러 메시지 즉시 제거
    if (value.trim().length > 0) {
      setNameError(false);
    }
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      setNameError(true); // 영구적으로 에러 표시 시작
      return;
    }
    
    updateProfile({ name, bio }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 text-white p-6">
      <div className="w-full max-w-md bg-[#2d2f36] p-8 rounded-2xl border border-zinc-700 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-400">마이페이지</h1>
          {!isEditing && (
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
            >
              설정
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* 이름 섹션 */}
          <div>
            <span className="block text-xs text-zinc-500 mb-1">이름</span>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange} 
                  className={`w-full bg-[#3a3d46] border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                    nameError ? "border-red-500" : "border-zinc-600 focus:border-purple-500"
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-[10px] mt-1 ml-1">
                    이름은 반드시 1글자 이상이어야합니다
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-bold">{name}</p>
            )}
          </div>

          {/* Bio 섹션 */}
          <div>
            <span className="block text-xs text-zinc-500 mb-1">한 줄 소개 (Bio)</span>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="자기소개를 입력해주세요 (선택)"
                className="w-full h-24 bg-[#3a3d46] border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 resize-none"
              />
            ) : (
              <p className="text-zinc-400">{bio || "소개가 없습니다."}</p>
            )}
          </div>

          {/* 이메일 섹션 */}
          <div>
            <span className="block text-xs text-zinc-500 mb-1">이메일</span>
            <p className={`text-base ${isEditing ? "text-zinc-500" : "text-zinc-300"}`}>
              {email}
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNameError(false);
                }}
                className="flex-1 py-3 bg-zinc-700 text-white rounded-xl font-bold hover:bg-zinc-600"
              >
                취소
              </button>
              <button 
                type="button"
                onClick={handleUpdate}
                disabled={isPending}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 disabled:opacity-50"
              >
                {isPending ? "저장 중..." : "저장"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};