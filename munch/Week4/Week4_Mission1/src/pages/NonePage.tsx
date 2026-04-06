import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function NonePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex justify-center items-center h-96">
      <p className="text-red-500 text-lg">에러가 발생했습니다.</p>
    </div>
  );
}
