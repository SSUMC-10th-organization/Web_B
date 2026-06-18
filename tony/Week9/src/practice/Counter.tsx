import { useReducer } from "react";

// TODO 1: State 타입을 정의하세요
// count: number 하나만 있으면 돼요
interface State {
  count: number;
}

// TODO 2: Action 타입을 정의하세요
// "increment" | "decrement" | "reset" 세 가지 액션이 필요해요
type Action =
  | { type: "increment"}
  | { type: "decrement" }
  | { type: "reset" };
  

// TODO 3: 초기 상태를 정의하세요
const initialState: State = {
  count : 0
};

// TODO 4: reducer 함수를 완성하세요
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "reset":
      return { ...state, count: 0 };
    default:
      return state;
  }
}

export default function Counter() {
  // TODO 5: useReducer를 사용해서 state와 dispatch를 가져오세요
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>카운터: {state.count}</h1>
      {/* TODO 6: 버튼 클릭 시 각각 dispatch를 호출하세요 */}
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
