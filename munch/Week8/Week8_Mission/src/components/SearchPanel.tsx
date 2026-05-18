import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RECENT_SEARCH_KEY = "recentSearches";
const MAX_RECENT = 5;

const getRecentSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveRecentSearch = (query: string) => {
  const prev = getRecentSearches();
  const updated = [query, ...prev.filter((q) => q !== query)].slice(
    0,
    MAX_RECENT,
  );
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
};

const removeRecentSearch = (query: string) => {
  const updated = getRecentSearches().filter((q) => q !== query);
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
};

type SearchType = "title" | "tag";

type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [recentSearches, setRecentSearches] =
    useState<string[]>(getRecentSearches);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    setRecentSearches(getRecentSearches());
    navigate(
      `/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`,
    );
    handleClose();
  };

  const handleRemoveRecent = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(q);
    setRecentSearches(getRecentSearches());
  };

  const handleClickRecent = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* 딤드 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
      )}

      {/* 검색 패널 - 위에서 아래로 슬라이드 */}
      <div
        className={`
					fixed top-0 left-0 right-0 z-50
					bg-[#0a0a0a] border-b border-gray-800
					transform transition-transform duration-300 ease-in-out
					${isOpen ? "translate-y-0" : "-translate-y-full"}
				`}
      >
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* 검색 입력 영역 */}
          <div className="flex items-center gap-3 mb-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as SearchType)}
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-[#e91e8c]"
            >
              <option value="title">제목</option>
              <option value="tag">태그</option>
            </select>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                searchType === "title" ? "제목으로 검색" : "태그로 검색"
              }
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-[#e91e8c] text-sm"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="px-4 py-2 bg-[#e91e8c] text-white text-sm rounded hover:bg-[#c2185b] transition-colors"
            >
              검색
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">최근 검색어</span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(RECENT_SEARCH_KEY);
                    setRecentSearches([]);
                  }}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  전체 지우기
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((q) => (
                  <span
                    key={q}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleClickRecent(q)}
                  >
                    {q}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRecent(q, e)}
                      className="text-gray-500 hover:text-white ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
