import { useEffect, useState } from "react"

export const useLocalStorage = (key : string, initial : any) => {
    const [token, setToken] = useState(()=>{
        const saved = localStorage.getItem(key);
        if (saved === null || saved === "null") return initial;
            return JSON.parse(saved);
    });

    
    useEffect(()=>{
        if (token === null || token === undefined) {
            localStorage.removeItem(key);
        }
        else
            localStorage.setItem(key,JSON.stringify(token));
    },[key,token])


    return [token,setToken];
}