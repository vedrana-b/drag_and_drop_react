import React, {useState} from 'react';


const JokeInput = (props) => {
    const [jokeId, setJokeId] = useState();
    const [error, setError] = useState('');
 
    /**
     * Function is executed on jokeId input change
     */
    const jokeIdChangeHandler = (event) => {
        let inputValue = event.target.value;

        // Validate jokeId input
        if (!Number.isInteger(Number(inputValue))) {
            setError('Please enter an integer');
        } else {
            setError('');
        }
        setJokeId(inputValue);
    }

    return (
        <div className="block block__input-container"
            onMouseDown={(event) => { event.stopPropagation() }}
            onMouseUp={(event) => { event.stopPropagation() }}
            >
            <div className="block__form">
                <label className="block__label">
                    <input onChange={jokeIdChangeHandler} className="block__input"></input>
                Enter a number
                </label>
                {error &&
                    <p>{error}</p>
                }
               
                <button className="block__button" onClick={() => {props.onGetJokes(jokeId)}}>Play with me!</button>
            </div>
        </div>
    )
}

export default JokeInput;