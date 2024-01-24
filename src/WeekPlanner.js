import React, { useEffect, useState } from "react";
import personsData from "./persons"; 
import tasksData from "./tasks"; 

const WeekPlanner = ({ selections, ponctualAbsences }) => {
  console.log("Props in WeekPlanner:", selections, ponctualAbsences);
  console.log("Using ponctualAbsences in WeekPlanner:", ponctualAbsences);
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
  
    // Vérifiez si la personne est marquée comme absente exceptionnelle pour ce jour
    const isAbsentExceptional =
      isMarkedAbsent &&
      ponctualAbsences[day] &&
      ponctualAbsences[day].has(person.name);
  
    if (task.name === "Absents") {
      return isMarkedAbsent || (isPersonUnavailable && !isDayWeekend) || isAbsentExceptional;
    }
  
    return (
      isTaskScheduledToday &&
      personSelection.roles.has(task.name) &&
      !isPersonUnavailable &&
      !isAbsentExceptional
    );
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
    if (isDayWeekend) {
      return []; 
    }
    
    return persons.filter(person => {
      const personSelection = selections[person.name];
      const isMarkedAbsent = personSelection.roles.has("Absents");
      const isPersonUnavailable = !person.availableDays.includes(day);
  
      return isMarkedAbsent || isPersonUnavailable;
    }).map(person => person.name);
  }
  
  function isDayInactive(task, day) {
    return !task.days.includes(day);
  }


function assignTasksEquitably() {
  let assignments = { "Cuisine": {}, "Nettoyage": {} };
  const totalDays = days.filter(day => day !== "SAMEDI" && day !== "DIMANCHE").length; // Exclure le weekend

  ["Cuisine", "Nettoyage"].forEach(task => {
    let availablePersons = persons.filter(person =>
      selections[person.name].roles.has(task)
    );

    let dayIndex = 0;
    availablePersons.forEach(person => {
      const day = days[dayIndex % totalDays];
      if (person.availableDays.includes(day)) {
        if (!assignments[task][day]) {
          assignments[task][day] = [];
        }
        assignments[task][day].push(person.name);
      }
      dayIndex++;
    });
  });

  return assignments;
}
 const taskAssignments = assignTasksEquitably();

  const renderTaskForDay = (taskName, day) => {
    return (
      taskAssignments[taskName][day]?.map(name => (
        <div key={`${taskName}-${day}-${name}`}>
          <span>{name}</span>
        </div>
      ))
    );
  };


    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    useEffect(() => {
      scrollToTop();
    }, []);

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
                    {(task.name === "Cuisine" || task.name === "Nettoyage") ?
                    renderTaskForDay(task.name, day) :
                    persons.map(person => (
                      <div key={`${task.name}-${day}-${person.name}`}>
                        {isPersonAssignedToTask(person, task, day) && (
                          <span>{person.name}</span>
                        )}
                      </div>
                    ))
                  }
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