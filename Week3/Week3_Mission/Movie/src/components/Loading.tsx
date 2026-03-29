const Loading = () => {
  return (
    // 전체 화면 높이(h-screen)를 차지하면서 정중앙 정렬
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      {/* 보라색 스피너 */}
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      {/* 선택사항: 로딩 중 텍스트 */}
      <p className="mt-4 text-purple-900 font-bold animate-pulse">영화 정보를 불러오고 있어요...</p>
    </div>
  );
};

export default Loading;