import { useEffect, useState } from "react"

export const useForm = <T extends Record<string,any>>(initial:T) =>{ // Key는 string이고, value는 상관없다! => 키밸류를 넣게되면 그것이 타입으로 고정된다
    const [values, setValue] = useState(initial); // ID, PW 받는 변수
    const [iderror, setidError] = useState(false); // ID 잘못되었을 때
    const [pwerror, setpwError] = useState(false); // PW 잘못되었을 때
    const [canlogin, setCanlogin] = useState(false); // 로그인이 가능한지
    const [checkpw, setCheckpw] = useState(false); // 회원가입시 pw 두번 입력이 일치하는지


    const regex = /@.*\./;
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
            setpwError(InputValue.length<8&&InputValue.length>0); //// 입력했다가 지울때 오류메시지 방지
        }
        if(name === 'confirmPassword'){
            setCheckpw(values.password !== InputValue && InputValue.length>0); // 회원가입 시 비밀번호 일치 확인
        }

    }
    useEffect(() => { // 로그인, 회원가입 버튼 활성화
        const isemailEmpty = values.email.length===0;
        const ispwEmpty = values.password.length===0;
        
        
        if(!iderror&&!pwerror&&!isemailEmpty&&!ispwEmpty)
            setCanlogin(true);
        else
            setCanlogin(false);

        

    },[values, iderror, pwerror]);


    return { values, iderror, pwerror, canlogin, checkpw, handleChange };
} 