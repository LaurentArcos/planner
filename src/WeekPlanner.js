import React, { useEffect, useState } from "react";
import personsData from "./persons"; 
import tasksData from "./tasks"; 

const WeekPlanner = ({ selections }) => {
  const tasks = tasksData; 
  const persons = personsData; 

  const days = [
    "LUNDI",
    "MARDI",
    "MERCREDI",
    "JEUDI",
    "VENDREDI",
    "SAMEDI",
    "DIMANCHE",
  ];

  function isPersonAssignedToTask(person, task, day) {
    const personSelection = selections[person.name];
    const isTaskScheduledToday = task.days.includes(day);
  
    const isMarkedAbsent = personSelection.roles.has("Absents");
    const isDayWeekend = day === "SAMEDI" || day === "DIMANCHE";
    const isPersonUnavailable = !person.availableDays.includes(day);
  
    if (task.name === "Absents") {
      return isMarkedAbsent || (isPersonUnavailable && !isDayWeekend);
    }
  
    return isTaskScheduledToday && personSelection.roles.has(task.name) && !isPersonUnavailable;
  }
  
  const groupedTasks = tasks.reduce((grouped, task) => {
    const group = task.group;
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(task);
    return grouped;
  }, {});

  function getAbsenteesForDay(day) {
    const isDayWeekend = day === "SAMEDI" || day === "DIMANCHE";
    return persons.filter(person => {
      const personSelection = selections[person.name];
      const isMarkedAbsent = personSelection.roles.has("Absents");
      const isPersonUnavailable = !person.availableDays.includes(day);
  
      return isMarkedAbsent || (isPersonUnavailable && !isDayWeekend);
    }).map(person => person.name);
  }

  
  function isDayInactive(task, day) {
    return !task.days.includes(day);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Tâches / Jours</th>
          {days.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
  {Object.entries(groupedTasks).map(([group, groupTasks]) => (
    <React.Fragment key={group}>
      {group && ( 
        <tr className="group-title">
          <td colSpan={days.length + 1}>{group}</td>
        </tr>
      )}
      {groupTasks.map((task) => (
        <tr key={task.name}>
          <td>{task.name}</td>
          {days.map((day) => (
            <td
              key={`${task.name}-${day}`}
              className={isDayInactive(task, day) ? "greyed-out" : ""}
            >
              {persons.map((person) => (
                <div key={`${task.name}-${day}-${person.name}`}>
                  {isPersonAssignedToTask(person, task, day) && (
                    <span>{person.name}</span>
                  )}
                </div>
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
