import { useEffect, useState } from "react"

export const useForm = <T extends Record<string,any>>(initial:T) =>{
    const [values, setValue] = useState(initial); // ID, PW 받는 변수
    const [iderror, setidError] = useState(false); // ID 잘못되었을 때
    const [pwerror, setpwError] = useState(false); // PW 잘못되었을 때
    const [canlogin, setCanlogin] = useState(false); // 로그인이 가능한지


    const regex = /@.*\.com/;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value: InputValue} = e.target;
        setValue({
            ...values,
            [name] : InputValue
        })
        
        // id, pw 유효성 검사
        if (name==='email'){
            const isSequential = regex.test(InputValue);  //@ 다음 . 이 나오는지 검사
            setidError(!isSequential&&InputValue.length>0); // 입력했다가 지울때 오류메시지 방지
        }
        if (name ==='password'){
            setpwError(InputValue.length<7&&InputValue.length>0); //// 입력했다가 지울때 오류메시지 방지
        }

    }
    useEffect(() => { // 로그인 버튼 활성화
        const isemailEmpty = values.email.length===0;
        const ispwEmpty = values.password.length===0;
        if(!iderror&&!pwerror&&!isemailEmpty&&!ispwEmpty)
            setCanlogin(true);
        else
            setCanlogin(false);

    },[values,iderror, pwerror]);


    return { values, iderror, pwerror, canlogin, handleChange };
} 