import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

export const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto>([]);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, []);
  return (
    <div>
      <div>{data.data?.name}</div>
      <div>{data.data?.email}</div>
      <div>{data.data?.updatedAt}</div>
    </div>
  );
};
