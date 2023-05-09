import { useDrag } from "react-dnd";
import React,{ useRef, useEffect, useState } from 'react';
import InputComponent from "../components/InputComponent";
import TextComponent from "../components/TextComponent";
import "./left.css";
import { getEmptyImage } from 'react-dnd-html5-backend';

function DragItem(props) {
  const [{ isDragging }, dragRef, connectDragPreview] = useDrag(() => ({
    type: props.type || 'TEXT',
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className="dragItem" ref={dragRef}>
      {props.children}
    </div>
  );
}


export default function LeftPanel() {
  return (
    <div className="leftPanel">
      <div>
        <h1>LeftPanel</h1>
        <div className="leftMaterialContiner">
          <DragItem>
            <TextComponent />
          </DragItem>
          <DragItem>
            <InputComponent />
          </DragItem>
        </div>
      </div>
    </div>
  );
}
