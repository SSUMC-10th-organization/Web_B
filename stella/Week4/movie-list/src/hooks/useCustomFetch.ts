import axios from "axios";
import { useEffect, useState } from "react";

const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const { data } = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [url]); // url이 바뀌면 자동 재요청

  return { data, isPending, isError };
};

export default useCustomFetch;
