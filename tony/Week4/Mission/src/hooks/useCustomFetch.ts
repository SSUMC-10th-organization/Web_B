import axios from "axios";
import { useEffect, useState } from "react";

const useCustomFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPending(true);
                const { data } = await axios.get<T>(url, {
                    headers: {
                        Authorization: import.meta.env.VITE_TMDB_TOKEN,
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
    }, [url]);

    return { data, isPending, isError };
};

export default useCustomFetch;