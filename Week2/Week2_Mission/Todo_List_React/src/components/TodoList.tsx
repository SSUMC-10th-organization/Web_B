import React from 'react';

interface todoProps{
    print(state : string) : React.ReactNode;
    c : string
}

function List({c,print}:todoProps){
    let name = undefined;
    let id = undefined;
    if(c==='todo'){
        name=c;
        id = c+'-list'
    }
    else if(c==='done'){
        name=c;
        id = c+'-list'
    }
    return(
        <div className={name}>{print(c)}</div>
     );
}
export default List;