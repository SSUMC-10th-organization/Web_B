// components/common/QueryState.tsx
interface Props {
    isPending: boolean;
    isError: boolean;
    onRetry: () => void;
    children: React.ReactNode;
}

export const QueryState = ({ isPending, isError, onRetry, children }: Props) => {
    if (isPending) return <div className="flex justify-center py-20 text-purple-500">로딩 중... (스피너/스켈레톤)</div>;
    if (isError) return (
        <div className="flex flex-col items-center py-20 gap-4">
            <p className="text-red-400">데이터를 불러오지 못했습니다.</p>
            <button type="button" onClick={onRetry} className="px-4 py-2 bg-zinc-800 rounded-md">다시 시도</button>
        </div>
    );
    return <>{children}</>;
};