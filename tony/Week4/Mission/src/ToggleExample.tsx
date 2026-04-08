import {useState} from "react";
import useToggle from "./hooks/useToggle";

function ToggleExample() {

    const [isOpen, toggle] = useToggle(false);
    return (
        <div>
            <h1>{isOpen?"열림":"안열림"}</h1>
            <button onClick = {toggle}>토글</button>
        </div>
    );

};

export default ToggleExample;