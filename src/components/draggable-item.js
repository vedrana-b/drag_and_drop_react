import React, { useState } from 'react';

const DraggableItem = (props) => {
    const [topOffset, setTopOffset] = useState(0);
    const [leftOffset, setLeftOffset] = useState(0);

    /**
     * Function is executed when item is dragged
     * @param {*} event 
     */
    const dragHandler = (event) => {
        // Get item distance from the screen
        const offsets = event.target.getBoundingClientRect();
        const top = offsets.top;
        const left = offsets.left;

        setTopOffset(props.y - top);
        setLeftOffset(props.x - left);
        props.onDrag(props.index);
    }

    /**
     * Function is executed when item is dropped
     */
    const dropHandler = () => {
        setLeftOffset(0);
        setTopOffset(0);
    }

    return (
        <div className="block-container">
            <div className="block"
                onMouseDown={dragHandler}
                onMouseUp={dropHandler}
                style={{
                    backgroundColor: props.color,
                    position: props.dragMode ? 'absolute' : 'static', top: props.y ? props.y - topOffset : 0, left: props.x ? props.x - leftOffset : 0,
                    width: props.dragMode ? '50%' : '100%',
                    height: props.dragMode ? '50%' : '100%',
                    zIndex: props.dragMode ? '1' : '0'
                }}>
                {props.children}
            </div>
        </div>
    )
}

export default DraggableItem;