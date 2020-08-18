import React, { useState, useEffect } from 'react';
import './App.scss';
import * as jokesService from './services/jokes.service';
import Joke from './components/joke';
import DraggableItem from './components/draggable-item';
import JokeInput from './components/jokeInput';

function App() {
    const [jokes, setJokes] = useState([]);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posX, setPosX] = useState();
    const [posY, setPosY] = useState();
    const [draggedBlock, setDraggedBlock] = useState();
    const [dragMode, setDragMode] = useState(false);

    /**
     * Run on initial load
     */
    useEffect(() => {
        // Retrieve initial jokes
        getRandomJokes();
    }, []);

    /**
     *  Run on every jokes change
     */
    useEffect(() => {
        // Prepare joke blocks
        const mappedJokes = jokes.map((item, index) => {
            return <Joke content={item.joke ? item.joke : item} ></Joke>
        });
        
        // Prepare content blocks
        const mappedContent = [<JokeInput onGetJokes={getJokes}></JokeInput>, ...mappedJokes].map((item, index) => {
            return { item, color: addBackground(index) }
        });

        setContent(mappedContent);
    }, [jokes]);
    
    /**
     * Function calls JOKE API to retrieve random jokes
     */
    const getRandomJokes = () => {
        setLoading(true);
        jokesService.getRandomJokes()
            .then(function (response) {
                setLoading(false);
                if (response.status === 200) {
                    setJokes(response.data.value);
                } else {
                    alert('There has been an error. Please try later.')
                }
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                console.log(error);
            })
    }

    /**
     * Function retrieve jokes as follows: 
     * If jokeId is present, function will retrieve 3 jokes starting with provided Id
     * Otherwise function will retrieve 3 random jokes
     * 
     * @param {integer} jokeId 
     */
    const getJokes = (jokeId) => {
        setLoading(true);

        if (jokeId) {
            // Validate jokeId
            if (!Number.isInteger(Number(jokeId))) {
                setLoading(false);
                return;
            }
            Promise.all(
                [jokesService.getJokeById(jokeId),
                jokesService.getJokeById(+jokeId + 1),
                jokesService.getJokeById(+jokeId + 2)]
            ).then(results => {
                let jokesFromResponse = results.map(response => {
                    return response.data.value;
                })
                setLoading(false);
                setJokes(jokesFromResponse);
            })
        } else {
            getRandomJokes();
        }
    }

    /**
     * Function returns color for block
     * 
     * @param {integer} index - Position of the block
     */
    const addBackground = (index) => {
        let pallete = ['red', 'yellow', 'blue', 'green'];
        return pallete[index];
    }

    /**
     * Function sets x,y position of mouse. 
     * Mouse cursor coordinates will be used for dragging blocks.
     * @param {*} event 
     */
    const mouseMoveHandler = (event) => {
        setPosX(event.clientX);
        setPosY(event.clientY);
    }

    /**
     * Function is executed when block is dragged
     * 
     * @param {*} index 
     */
    const dragHandler = (index) => {
        setDragMode(true);
        setDraggedBlock(index);
    }

    /**
     * Function is executed when block is dropped
     * 
     * @param {*} event 
     */
    const dropHandler = (event) => {
        const dropableBlock = +event.target.getAttribute('data-pos');

        setDragMode(false);
        // Rearrange order of blocks only if all params are present
        if (isNaN(draggedBlock) || isNaN(dropableBlock)) {
            return;
        }

        // Rearrange order of blocks 
        const contentCopy = [...content];
        const temp = contentCopy[draggedBlock];
        contentCopy[draggedBlock] = contentCopy[dropableBlock];
        contentCopy[dropableBlock] = temp;

        setContent(contentCopy);
    }

    return (
        <React.Fragment>
            <div onMouseMove={mouseMoveHandler} className="grid-container">
                {content.map((item, index) => {
                    return <DraggableItem
                        dragMode={dragMode && (draggedBlock === index)}
                        onDrag={dragHandler}
                        x={posX}
                        y={posY}
                        key={index}
                        index={index}
                        color={item.color}
                        >
                        {item.item}
                    </DraggableItem>
                })}
                <div style={{ zIndex: dragMode ? '1' : '-1' }} className="hidden-container">
                    <div data-pos='0' onMouseUp={dropHandler} className="hidden-container__item"></div>
                    <div data-pos='1' onMouseUp={dropHandler} className="hidden-container__item"></div>
                    <div data-pos='2' onMouseUp={dropHandler} className="hidden-container__item"></div>
                    <div data-pos='3' onMouseUp={dropHandler} className="hidden-container__item"></div>
                </div>
            </div>
            {loading &&
                <div className="spinner">
                    <div className="spinner-icon"></div>
                </div>
            }
        </React.Fragment>
    );
}

export default App;
