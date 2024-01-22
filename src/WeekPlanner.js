import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const WeekPlanner = ({ selections }) => {
  const initialPlanning = {
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: []
  };

  const [planning, setPlanning] = useState(initialPlanning);



  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
  
    // Si l'élément est déposé en dehors d'une zone droppable, ne rien faire
    if (!destination) {
      return;
    }
  
    // Si l'emplacement source et destination sont les mêmes, ne rien faire
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    // Logique pour réorganiser le planning
    const start = planning[source.droppableId];
    const finish = planning[destination.droppableId];
  
    // Déplacer au sein du même jour
    if (start === finish) {
      const newTasks = Array.from(start);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);
  
      const newPlanning = {
        ...planning,
        [source.droppableId]: newTasks,
      };
  
      setPlanning(newPlanning);
      return;
    }
  
    // Déplacer d'un jour à un autre
    const startTasks = Array.from(start);
    const [removed] = startTasks.splice(source.index, 1);
    const finishTasks = Array.from(finish);
    finishTasks.splice(destination.index, 0, removed);
  
    const newPlanning = {
      ...planning,
      [source.droppableId]: startTasks,
      [destination.droppableId]: finishTasks,
    };
  
    setPlanning(newPlanning);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.keys(planning).map((day) => (
        <Droppable droppableId={day} key={day}>
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <h4>{day}</h4>
              {planning[day].map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      {task.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default WeekPlanner;