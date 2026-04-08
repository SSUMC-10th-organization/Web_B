import useForm from "../../hooks/useForm";

type EmailFields = { email: string };

const validate = (
	values: EmailFields,
): Partial<Record<keyof EmailFields, string>> => {
	const errors: Partial<Record<keyof EmailFields, string>> = {};
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "올바른 이메일 형식을 입력해주세요.";
	}
	return errors;
};

interface Props {
	onNext: (email: string) => void;
}

function EmailStep({ onNext }: Props) {
	const { values, errors, touched, handleChange, handleBlur, isValid } =
		useForm<EmailFields>({ email: "" }, validate);

	return (
		<div className="flex flex-col gap-4">
			<p className="text-gray-400 text-sm">사용할 이메일을 입력해주세요.</p>

			<div className="flex flex-col gap-1">
				<input
					type="email"
					name="email"
					placeholder="이메일을 입력해주세요!"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
				/>
				{touched.email && errors.email && (
					<p className="text-red-400 text-sm">{errors.email}</p>
				)}
			</div>

			<button
				type="button"
				onClick={() => onNext(values.email)}
				disabled={!isValid}
				className={`w-full py-3 rounded-md text-base font-medium transition ${
					isValid
						? "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
						: "bg-gray-800 text-gray-500 cursor-not-allowed"
				}`}
			>
				다음
			</button>
		</div>
	);
}

export default EmailStep;
