import React from 'react';

const Joke = (props) => {
    return (
        <p onMouseDown={(event) => { event.stopPropagation() }} className="block__text">{props.content}</p>
    )
}

export default Joke;