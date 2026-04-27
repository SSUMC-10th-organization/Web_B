import { type ChangeEvent, useEffect, useState } from "react";

interface UserFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UserFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>();
  const [errors, setErrors] = useState<Record<string, string>>();

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...values,
      [name]: true,
    });
  };

  // 이메일, 패스워드 인풋, 속성들을 가져오는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
