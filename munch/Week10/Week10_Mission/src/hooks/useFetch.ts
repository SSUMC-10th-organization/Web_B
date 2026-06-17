import type { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { axiosClient } from "../apis/axiosClient";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const optionsString = JSON.stringify(options);
  const prevOptionsRef = useRef<string>("");

  useEffect(() => {
    if (prevOptionsRef.current === optionsString && data !== null) return;
    prevOptionsRef.current = optionsString;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const parsedOptions = optionsString
          ? JSON.parse(optionsString)
          : undefined;
        const { data: responseData } = await axiosClient.get<T>(url, {
          ...parsedOptions,
        });
        setData(responseData);
      } catch {
        setError("데이터를 가져오는 중 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, optionsString]);

  return { data, error, isLoading };
};

export default useFetch;
