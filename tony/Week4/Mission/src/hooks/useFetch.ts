import axios from "axios";
import { useEffect, useState } from "react";

function useFetch<T>(url: string) { //제네릭 (재사용 가능)
    const [data, setData] = useState<T>();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPending(true);
                const { data } = await axios.get<T>(url, {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
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
}
export default useFetch;