import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const WeekPlanner = ({ selections }) => {
 
  const tasks = {
    "QUOTIDIEN": ["Cuisine", "Nettoyage"],
    "LOGISTIQUE": ["Pilote session", "Astreinte Prestataires / Repassage"],
    "S.A.V": ["8h-16h", "9h-17h", "11h-19h"],
    "BOUTIQUES": ["Boutique Paris", "Boutique Toulon"]
  };

  const initialPlanning = {
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: []
  };
  
  const days = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

  const [planning, setPlanning] = useState(initialPlanning);

  function shouldBeGreyedOut(task, day) {
    if ((task.startsWith("Boutique") && day === "dimanche" && task.includes("Toulon")) ||
        (["Cuisine", "Nettoyage", "Pilote session", "Astreinte prestataires / Repassage", "8-16", "9-17", "11-19"].includes(task) && (day === "samedi" || day === "dimanche"))) {
      return true;
    }
    return false;
  }

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
  

    if (!destination) {
      return;
    }
  

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  

    const start = planning[source.droppableId];
    const finish = planning[destination.droppableId];
  

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


  const preparePlanningData = (selections) => {
    let newPlanning = { ...initialPlanning };
    
    Object.keys(selections).forEach(person => {
      selections[person].forEach(role => {
        for (let day of days) {
          if (!shouldBeGreyedOut(role, day) && !personAlreadyAssigned(newPlanning, person, day)) {
            if (!newPlanning[day]) {
              newPlanning[day] = []; // Initialiser comme un tableau vide si non défini
            }
            newPlanning[day].push({ id: `${person}-${role}-${day}`, role, person });
            break;
          }
        }
      });
    });
    
    return newPlanning;
  };
  
  function personAlreadyAssigned(planning, person, day) {
    return planning[day] && planning[day].some(taskData => taskData.person === person);
  }

  useEffect(() => {
    setPlanning(preparePlanningData(selections));
  }, [selections]);


return (
      <table>
        <thead>
          <tr>
            <th>Tâche / Jour</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
      {Object.entries(tasks).map(([group, subTasks]) => (
        <React.Fragment key={group}>
          <tr className="group-title">
            <td colSpan={days.length + 1}>{group}</td>
          </tr>
          {subTasks.length > 0 && subTasks.map(task => (
            <tr key={task}>
              <td>{task}</td>
              {days.map(day => (
                <td key={day} className={shouldBeGreyedOut(task, day) ? "greyed-out" : "task"}>
                {planning[day] && planning[day]
                  .filter(taskData => taskData.role === task)
                  .map(taskData => <div key={taskData.id}>{taskData.person}</div>)}
              </td>
              ))}
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
);
};

export default WeekPlanner;