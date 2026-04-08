import { useState, useCallback } from "react";

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const updated = { ...values, [name]: value } as T;
      setValues(updated);
      setErrors(validate(updated));
    },
    [values, validate]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  const isValid =
    Object.values(values).every((v) => v.trim() !== "") &&
    Object.keys(validate(values)).length === 0;

  return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;
