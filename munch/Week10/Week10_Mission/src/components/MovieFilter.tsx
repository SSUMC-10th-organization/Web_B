import { memo, useCallback, useState } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>("");
  const [includedAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const filters: MovieFilters = {
        query,
        include_adult: includedAdult,
        language,
      };
      onChange(filters);
    },
    [query, includedAdult, language, onChange],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="transform space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-all hover:shadow-2xl"
    >
      <div className="flex flex-wrap gap-6">
        <div className="min-w-[450px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            🎬 영화 제목
          </label>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="영화 제목을 입력하세요"
          />
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            🔞 옵션
          </label>
          <SelectBox
            checked={includedAdult}
            onChange={setIncludeAdult}
            label="성인 콘텐츠 포함"
            id="include_adult"
            className="h-[42px] w-full rounded-lg border border-gray-300 px-4"
          />
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            🌐 언어
          </label>
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            options={LANGUAGE_OPTIONS}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            🔍 영화 검색
          </button>
        </div>
      </div>
    </form>
  );
};

export default memo(MovieFilter);
