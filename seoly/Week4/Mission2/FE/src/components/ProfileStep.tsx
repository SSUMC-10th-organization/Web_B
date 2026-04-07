import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
	type NameStepInformation,
	nameStepSchema,
	type UserSignupInformation,
} from "../utils/validate";

interface Props {
	email: string;
	password: string;
	name: string;
	onNext: (data: UserSignupInformation) => void; // 다음 단계로 넘어가는 함수
	onPrev: () => void;
}

const ProfileStep = ({ onNext, onPrev, email, password }: Props) => {
	const navigate = useNavigate();

	const goToHome = () => {
		navigate("/");
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<NameStepInformation>({
		resolver: zodResolver(nameStepSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
		},
	});

	const handleFinalSubmit = (data: NameStepInformation) => {
		// 1. 앞 단계에서 Props로 받은 데이터와 현재 입력된 닉네임을 하나로 합칩니다.
		const fullData: UserSignupInformation = {
			email: email, // Props에서 가져옴
			password: password, // Props에서 가져옴
			passwordConfirm: password, // 2단계에서 이미 확인했으므로 password와 동일하게 설정
			name: data.name, // 현재 폼 입력값에서 가져옴
		};

		onNext(fullData);

		alert(`${data.name}님, 회원가입이 완료되었습니다!`);
		goToHome();
	};

	return (
		<div className="w-full max-w-[400px] flex flex-col">
			{/* < 회원가입 */}
			<div className="w-full flex items-center justify-center gap-10 mb-10 relative">
				<button
					type="button"
					className="absolute left-0 text-[#FFFFFF]"
					onClick={onPrev}
				>
					{`<`}
				</button>
				<h1 className="flex-1 text-center text-[#FFFFFF] text-xl font-medium">
					회원가입
				</h1>
			</div>
			<div className="flex flex-col gap-3">
				<div className="self-center w-[200px] h-[200px] border border-[#FFFFFF] rounded-full"></div>

				<input
					{...register("name")}
					className={`bg-[#222222]  border border-[#ccc] w-[300w] p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]`}
					type={"nickname"}
					placeholder={"닉네임을 입력해주세요."}
				/>

				<button
					className="w-full bg-[#D7288E] text-white py-3 rounded-md text-lg font-medium hover:bg-[#C32A82] transition-colors cursor-pointer disabled:bg-gray-700"
					type="button"
					onClick={handleSubmit(handleFinalSubmit)}
					disabled={!isValid}
				>
					회원가입 완료
				</button>
			</div>
		</div>
	);
};

export default ProfileStep;
