import { type ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
	initialValue: T;
	//값이 올바른지 검증하는 함수
	validate: (value: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
	const [values, setValues] = useState(initialValue);
	const [touched, setTouched] = useState<Record<string, boolean>>();
	const [errors, setErrors] = useState<Record<string, string>>();
	//Record에 string, boolean이 들어오는거 <- 키, value(boolean, string)

	//사용자가 입력값 바꿀 때 실행되는 함수
	const handleChange = (name: keyof T, text: string) => {
		setValues({
			...values, //기존 값 유지 (다른걸 변경했을 때 바뀌면 안되니까)
			[name]: text,
		});
	};

	//선택 여부?라고 해야하나..
	const handleBlur = (name: keyof T) => {
		setTouched({
			...touched,
			[name]: true,
		});
	};

	const getInputProps = (name: keyof T) => {
		const value = values[name];

		const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			handleChange(name, e.target.value);

		const onBlur = () => handleBlur(name);

		return { value, onChange, onBlur };
	};

	useEffect(() => {
		const newErrors = validate(values);
		setErrors(newErrors); //오류 메세지 생길 때마다 넣기
	}, [validate, values]);

	return { values, errors, touched, getInputProps };
}

export default useForm;
