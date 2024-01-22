import React, { useEffect, useState } from 'react';

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
  const weekdays = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"];

  const [planning, setPlanning] = useState(initialPlanning);

  function shouldBeGreyedOut(task, day) {
    const isWeekend = day === "SAMEDI" || day === "DIMANCHE";
    const isBoutiqueToulonClosed = task === "Boutique Toulon" && day === "DIMANCHE";
    const isTaskWeekdayOnly = ["Cuisine", "Nettoyage", "Pilote session", "Astreinte Prestataires / Repassage", "8h-16h", "9h-17h", "11h-19h"].includes(task);

    return isWeekend && (isBoutiqueToulonClosed || isTaskWeekdayOnly);
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


  function getNextAvailableDay(planning, role, person, startDay) {
    let availableDays = role.startsWith("Boutique Paris") ? days :
                        role === "Boutique Toulon" ? [...weekdays, "SAMEDI"] :
                        weekdays;

    if (role === "Astreinte Prestataires / Repassage") {
      return "MERCREDI"; // Assigner uniquement le mercredi
    }

    for (let i = 0; i < availableDays.length; i++) {
      const dayIndex = (days.indexOf(startDay) + i) % days.length;
      const day = days[dayIndex];

      if (!shouldBeGreyedOut(role, day) && availableDays.includes(day) && !personAlreadyAssigned(planning, person, day)) {
        if (role === "Cuisine" && planning[day].filter(task => task.role === "Cuisine").length < 2) {
          return day;
        } else if (role !== "Cuisine") {
          return day;
        }
      }
    }
    return null;
  }

  const preparePlanningData = (selections) => {
    let newPlanning = { ...initialPlanning };
    let startDay = "LUNDI";
  
    Object.keys(selections).forEach(person => {
      selections[person].forEach(role => {
        if (role === "Nettoyage") {
          // S'assurer que la personne n'est pas assignée à la cuisine le même jour
          const daysWithCuisine = Object.keys(newPlanning).filter(day => 
            newPlanning[day].some(task => task.role === "Cuisine" && task.person === person)
          );
  
          // Traitement pour éviter le nettoyage le jour de la cuisine
          const availableDayForCleaning = days.find(day => 
            !daysWithCuisine.includes(day) && 
            getNextAvailableDay(newPlanning, role, person, startDay) === day
          );
  
          if (availableDayForCleaning) {
            if (!newPlanning[availableDayForCleaning]) {
              newPlanning[availableDayForCleaning] = [];
            }
            newPlanning[availableDayForCleaning].push({ id: `${person}-${role}-${availableDayForCleaning}`, role, person });
          }
        } else {
          // Traitement normal pour les autres rôles
          const availableDay = getNextAvailableDay(newPlanning, role, person, startDay);
          if (availableDay) {
            if (!newPlanning[availableDay]) {
              newPlanning[availableDay] = [];
            }
            newPlanning[availableDay].push({ id: `${person}-${role}-${availableDay}`, role, person });
            startDay = days[(days.indexOf(availableDay) + 1) % days.length];
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
                  .map(taskData => (
                    <div key={taskData.id}>{taskData.person}</div>
                ))}
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