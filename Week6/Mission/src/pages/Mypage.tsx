import { useEffect, useState } from "react";
import { api } from "../apis/axiosInstance";

type MeResponse = {
	data: {
		id: number;
		email: string;
		name: string;
	};
};

export const MyPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const getMyInfo = async () => {
			const response = await api.get<MeResponse>("/v1/users/me");

			setName(response.data.data.name);
			setEmail(response.data.data.email);
		};

		getMyInfo();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center mt-20 text-white">
			<h1 className="text-3xl font-bold">마이페이지</h1>
			<p className="mt-4">이름: {name}</p>
			<p>이메일: {email}</p>
		</div>
	);
};