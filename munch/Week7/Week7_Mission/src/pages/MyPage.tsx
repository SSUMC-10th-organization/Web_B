import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInfo, updateUser, uploadImage } from "../apis/auth";
import { ErrorFallback, LoadingSpinner } from "../components/CommonStates";
import { LpCardSkeleton } from "../components/Skeletons";
import { toast } from "../components/Toast";
import type { PAGINATION_ORDER } from "../enums/common";
import useGetMyLikedLpList from "../hooks/queries/useGetMyLikedLpList";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { ResponseMyInfoDto } from "../types/auth";
import type { Lp } from "../types/lp";
import { formatTimeAgo } from "../utils/date";
import useGetMyLpList from "../hooks/queries/useGetMyLpList";

type TabType = "liked" | "written";

const initSkeletonKeys = Array.from({ length: 6 }, (_, i) => `my-sk-${i}`);

const LpGrid = ({ tab, order }: { tab: TabType; order: PAGINATION_ORDER }) => {
  const likedQuery = useGetMyLikedLpList(order);
  const writtenQuery = useGetMyLpList(order);

  const query = tab === "liked" ? likedQuery : writtenQuery;
  const {
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query;

  const loadMoreRef = useIntersectionObserver(fetchNextPage, hasNextPage);

  const lps: Lp[] = query.data?.pages.flatMap((page) => page.data.data) ?? [];

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {initSkeletonKeys.map((key) => (
          <LpCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorFallback onRetry={refetch} />;

  if (lps.length === 0) {
    return (
      <div className="flex justify-center py-16 text-gray-500 text-sm">
        {tab === "liked" ? "좋아요한 LP가 없습니다." : "작성한 LP가 없습니다."}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {lps.map((lp: Lp) => (
          <Link
            key={lp.id}
            to={`/lp/${lp.id}`}
            className="group relative aspect-square overflow-hidden rounded bg-gray-800 block"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h3 className="text-white font-bold text-sm truncate">
                {lp.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-300 text-xs">
                  {formatTimeAgo(lp.createdAt)}
                </span>
                <span className="text-[#e91e8c] text-xs font-semibold">
                  ♥ {lp.likes?.length || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }, (_, i) => `more-sk-${i}`).map((key) => (
            <LpCardSkeleton key={key} />
          ))}
      </div>
      <div ref={loadMoreRef} className="h-6 w-full" />
    </>
  );
};

const MyPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("liked");
  const [order, setOrder] = useState<PAGINATION_ORDER>("desc");

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const previousMyInfo = queryClient.getQueryData(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (old: ResponseMyInfoDto) => ({
        ...old,
        data: {
          ...old.data,
          name,
          bio: bio || old.data.bio,
          avatar: avatarUrl || old.data.avatar,
        },
      }));

      return { previousMyInfo };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData(["myInfo"], context.previousMyInfo);
      }
      toast.error("수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
    onSuccess: () => {
      setIsEditing(false);
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
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 flex items-center gap-6 mb-6">
        <button
          type="button"
          onClick={() => isEditing && fileInputRef.current?.click()}
          className={`w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center shrink-0 ${
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
            <span className="text-3xl text-gray-400">👤</span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-black text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#e91e8c]"
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
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio (선택사항)"
              className="w-full bg-black text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#e91e8c]"
            />
            <p className="text-gray-500 text-xs">{myInfo?.email}</p>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-gray-500 hover:text-white text-left"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{myInfo?.name}</h2>
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

      <div className="border-b border-gray-800 mb-2">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("liked")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "liked"
                ? "border-[#e91e8c] text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 좋아요 한 LP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("written")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "written"
                ? "border-[#e91e8c] text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 작성한 LP
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => setOrder("asc")}
          className={`px-4 py-1.5 text-sm rounded border transition-colors ${
            order === "asc"
              ? "bg-white text-black border-white font-semibold"
              : "border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          오래된순
        </button>
        <button
          type="button"
          onClick={() => setOrder("desc")}
          className={`px-4 py-1.5 text-sm rounded border transition-colors ${
            order === "desc"
              ? "bg-white text-black border-white font-semibold"
              : "border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          최신순
        </button>
      </div>

      <LpGrid tab={activeTab} order={order} />
    </div>
  );
};

export default MyPage;
