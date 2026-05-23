import { useState, useReducer } from "react";

// 1. state에 대한 인터페이스
interface IState{
    counter : number;
}
// 2. reducer에 대한 인터페이스
interface IAction {
    type :  'INCREASE'|'DECREASE'|'RESET_TO_ZERO';
    payload : number;
}

function reducer(state : IState, action : IAction): IState {
    const {type,payload} = action;
    console.log(action);
    console.log(state);

    switch(type){
        case 'INCREASE' : return { ...state, counter : state.counter+payload};
        case 'DECREASE' : return {...state, counter : state.counter-1};
        case 'RESET_TO_ZERO' : return {...state, counter : 0};
        default :
            return state;
    }
}

export default function UseReducerPage() {
    //1. useState
    const [count, setCount] = useState(0);

    //2. useReducer
    const [state, dispatch] = useReducer(reducer ,{
        counter : 0
    } )

    const handleIncrease = () : void => {
        setCount(count+1);
    };

    return (
        <div>
            <h3>useState 훅 사용 : </h3>
            <h1>{count}</h1>
            <button type="button" onClick={handleIncrease}>Increase</button>

            <h3>useReducer 훅 사용 : </h3>
            <h1>{state.counter}</h1>
            <button type="button" onClick={():void => dispatch({
                    type:'INCREASE', payload : 1
                })}>Increase</button>
            <button type="button" onClick={():void => dispatch({
                    type:'DECREASE', payload : 1
                })}>Decrease</button>
            <button type="button" onClick={():void => dispatch({
                    type:'RESET_TO_ZERO', payload : 0
                })}>Reset</button>    
        </div>
    );
}