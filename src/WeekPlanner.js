import React, { useEffect, useState } from "react";
import personsData from "./persons"; // Importer les données des personnes
import tasksData from "./tasks"; // Importer les données des tâches

const WeekPlanner = ({ selections }) => {
  const tasks = tasksData; // Utiliser les données des tâches à partir du fichier
  const persons = personsData; // Utiliser les données des personnes à partir du fichier

  const days = [
    "LUNDI",
    "MARDI",
    "MERCREDI",
    "JEUDI",
    "VENDREDI",
    "SAMEDI",
    "DIMANCHE",
  ];

  // Fonction pour vérifier si une personne est déjà attribuée à une tâche pour un jour donné
  function isPersonAssignedToTask(person, task, day) {
    const personSelection = selections[person.name];
    const isTaskScheduledToday = task.days.includes(day);
  
    if (personSelection.roles.has("Absent")) {
      return task.name === "Absent";
    }
    return (
      isTaskScheduledToday &&
      personSelection.roles.has(task.name) &&
      person.availableDays.includes(day)
    );
  }

  // Regrouper les tâches par groupe
  const groupedTasks = tasks.reduce((grouped, task) => {
    const group = task.group;
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(task);
    return grouped;
  }, {});

  // Fonction pour vérifier si un jour est inactif pour un groupe de tâches
  function isDayInactive(task, day) {
    console.log(task); // Ajouter pour le débogage
    return !task.days.includes(day);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Tâches / Jours</th>
          {days.map((day) => (
  <th
    key={day}
  >
    {day}
  </th>
))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedTasks).map(([group, groupTasks]) => (
          <React.Fragment key={group}>
            <tr className="group-title">
              <td colSpan={days.length + 1}>{group}</td>
            </tr>
            {groupTasks.map((task) => (
              <tr key={task.name}>
                <td>{task.name}</td>
                {days.map(day => (
  <td key={`${task.name}-${day}`} className={isDayInactive(task, day) ? 'greyed-out' : ''}>
    {persons.map(person => (
      <div key={`${task.name}-${day}-${person.name}`}>
        {isPersonAssignedToTask(person, task, day) && <span>{person.name}</span>}
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
