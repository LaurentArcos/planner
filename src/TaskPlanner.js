import React, { useState, useEffect } from "react";
import personsData from "./persons"; // Assurez-vous que le chemin est correct
import tasksData from "./tasks"; // Assurez-vous que le chemin est correct

const TaskPlanner = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [persons, setPersons] = useState(personsData);
  const [selections, setSelections] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const days = [
    "Toute la semaine",
    "LUNDI",
    "MARDI",
    "MERCREDI",
    "JEUDI",
    "VENDREDI",
    "SAMEDI",
    "DIMANCHE",
  ];
  const [showSimplifiedView, setShowSimplifiedView] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const SAV_TASKS = ["S.A.V. (8h-16h)", "S.A.V. (9h-17h)", "S.A.V. (10h-18h)"];

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  const toggleView = () => {
    setShowSimplifiedView(!showSimplifiedView);
    scrollToTop();
  };

  const getEndDate = (startDate) => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6); 
    return end.toLocaleDateString();
  };

  useEffect(() => {
    let initialSelections = {};
    tasks.forEach((task) => {
      days.forEach((day) => {
        initialSelections[`${task.name}-${day}`] = [];
      });
    });
  
    // Définition des sélections par défaut
    const defaultSelections = [
      { name: "Nolan", task: "Boutique Toulon", days: ["SAMEDI"] },
      { name: "Lucie", task: "Absents", days: ["LUNDI", "MARDI"] },
      { name: "Hugo", task: "Absents", days: ["JEUDI", "VENDREDI"] },
      { name: "Lorenzo", task: "Absents", days: ["LUNDI", "MARDI", "MERCREDI"] },
      { name: "Lorenzo", task: "Boutique Toulon", days: ["JEUDI", "VENDREDI","SAMEDI"] },
      { name: "Elino", task: "Absents", days: ["LUNDI", "MARDI"] },
      { name: "Quentin", task: "Absents", days: ["JEUDI", "VENDREDI"] },
      { name: "Oualid", task: "Absents", days: ["JEUDI", "VENDREDI"] },
    ];
  
    // Appliquer les sélections par défaut
    defaultSelections.forEach(sel => {
      sel.days.forEach(day => {
        if (!initialSelections[`${sel.task}-${day}`].includes(sel.name)) {
          initialSelections[`${sel.task}-${day}`].push(sel.name);
        }
      });
    });
  
    setSelections(initialSelections);
  }, [tasks, persons]);

  const handleOpenModal = (task, day) => {
    setSelectedTask(task);
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getFormattedDate = (date) => {
    let year = date.getFullYear().toString().slice(2);
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const getWeekPeriod = (selectedDate) => {
    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    // Ajuster pour commencer le lundi de la semaine et finir le dimanche
    startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
    endDate.setDate(endDate.getDate() + (endDate.getDay() === 0 ? 0 : 7 - endDate.getDay()));

    return {
      start: getFormattedDate(startDate),
      end: getFormattedDate(endDate)
    };
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const { start, end } = getWeekPeriod(selectedDate);
    setSelectedDateRange(`${start} au ${end}`);
  };

const handleSelectionChange = (personName, isChecked) => {
    const key = `${selectedTask.name}-${selectedDay}`;
    let updatedSelections = { ...selections };

    // Pour les tâches S.A.V., vérifier si la personne est déjà assignée à un autre créneau S.A.V. sur le même jour
    if (SAV_TASKS.includes(selectedTask.name) && isChecked) {
        const isAssignedToOtherSAV = SAV_TASKS.some((taskName) => {
            if (taskName !== selectedTask.name) {
                return selections[`${taskName}-${selectedDay}`]?.includes(personName);
            }
            return false;
        });

        if (isAssignedToOtherSAV) {
            // Si déjà assigné à un autre créneau S.A.V., retourner sans modifier les sélections
            return;
        }
    }

    // Interdire la sélection croisée entre "Cuisine" et "Nettoyage" pour le même jour
    if ((selectedTask.name === "Cuisine" || selectedTask.name === "Nettoyage") && isChecked) {
        const oppositeTask = selectedTask.name === "Cuisine" ? "Nettoyage" : "Cuisine";
        const oppositeKey = `${oppositeTask}-${selectedDay}`;
        const isAlreadyAssignedToOpposite = selections[oppositeKey]?.includes(personName);
        
        // Si déjà assigné à la tâche opposée, retourner sans modifier les sélections
        if (isAlreadyAssignedToOpposite) {
            alert(`${personName} ne peut pas être assigné(e) à "${selectedTask.name}" et "${oppositeTask}" le même jour.`);
            return;
        }
    }

    // Gérer la sélection pour "Absents - Toute la semaine"
    if (selectedTask.name === "Absents" && selectedDay === "Toute la semaine") {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Absents-${day}`] = [
            ...new Set([...updatedSelections[`Absents-${day}`], personName]),
          ];
        } else {
          updatedSelections[`Absents-${day}`] = updatedSelections[
            `Absents-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Cuisine - Toute la semaine"
    if (selectedTask.name === "Cuisine" && selectedDay === "Toute la semaine") {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Cuisine-${day}`] = [
            ...new Set([...updatedSelections[`Cuisine-${day}`], personName]),
          ];
        } else {
          updatedSelections[`Cuisine-${day}`] = updatedSelections[
            `Cuisine-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Nettoyage - Toute la semaine"
    if (
      selectedTask.name === "Nettoyage" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Nettoyage-${day}`] = [
            ...new Set([...updatedSelections[`Nettoyage-${day}`], personName]),
          ];
        } else {
          updatedSelections[`Nettoyage-${day}`] = updatedSelections[
            `Nettoyage-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "S.A.V. (8h-16h) - Toute la semaine"
    if (
      selectedTask.name === "S.A.V. (8h-16h)" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`S.A.V. (8h-16h)-${day}`] = [
            ...new Set([
              ...updatedSelections[`S.A.V. (8h-16h)-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`S.A.V. (8h-16h)-${day}`] = updatedSelections[
            `S.A.V. (8h-16h)-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "S.A.V. (9h-17h) - Toute la semaine"
    if (
      selectedTask.name === "S.A.V. (9h-17h)" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`S.A.V. (9h-17h)-${day}`] = [
            ...new Set([
              ...updatedSelections[`S.A.V. (9h-17h)-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`S.A.V. (9h-17h)-${day}`] = updatedSelections[
            `S.A.V. (9h-17h)-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "S.A.V. (10h-18h) - Toute la semaine"
    if (
      selectedTask.name === "S.A.V. (10h-18h)" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`S.A.V. (10h-18h)-${day}`] = [
            ...new Set([
              ...updatedSelections[`S.A.V. (10h-18h)-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`S.A.V. (10h-18h)-${day}`] = updatedSelections[
            `S.A.V. (10h-18h)-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Astreinte Prestataires / Repassage - Toute la semaine"
    if (
      selectedTask.name === "Astreinte Prestataires / Repassage" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Astreinte Prestataires / Repassage-${day}`] = [
            ...new Set([
              ...updatedSelections[`Astreinte Prestataires / Repassage-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`Astreinte Prestataires / Repassage-${day}`] =
            updatedSelections[
              `Astreinte Prestataires / Repassage-${day}`
            ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Pilote Session - Toute la semaine"
    if (
      selectedTask.name === "Pilote Session" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Pilote Session-${day}`] = [
            ...new Set([
              ...updatedSelections[`Pilote Session-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`Pilote Session-${day}`] = updatedSelections[
            `Pilote Session-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Boutique Toulon - Toute la semaine"
    if (
      selectedTask.name === "Boutique Toulon" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Boutique Toulon-${day}`] = [
            ...new Set([
              ...updatedSelections[`Boutique Toulon-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`Boutique Toulon-${day}`] = updatedSelections[
            `Boutique Toulon-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Gérer la sélection pour "Boutique Paris - Toute la semaine"
    if (
      selectedTask.name === "Boutique Paris" &&
      selectedDay === "Toute la semaine"
    ) {
      days.forEach((day) => {
        if (isChecked) {
          updatedSelections[`Boutique Paris-${day}`] = [
            ...new Set([
              ...updatedSelections[`Boutique Paris-${day}`],
              personName,
            ]),
          ];
        } else {
          updatedSelections[`Boutique Paris-${day}`] = updatedSelections[
            `Boutique Paris-${day}`
          ].filter((name) => name !== personName);
        }
      });
      setSelections(updatedSelections);
      return;
    }

    // Cas général pour toutes les tâches sauf "Cuisine" et "Nettoyage"
    if (selectedTask.name !== "Cuisine" && selectedTask.name !== "Nettoyage") {
      if (isChecked) {
        if (!updatedSelections[key].includes(personName)) {
          updatedSelections[key].push(personName);
        }
      } else {
        updatedSelections[key] = updatedSelections[key].filter(
          (name) => name !== personName
        );
      }
    }

    // Cas spécifique pour les tâches "Cuisine" et "Nettoyage"
    if (selectedTask.name === "Cuisine" || selectedTask.name === "Nettoyage") {
      if (isChecked) {
        updatedSelections[key].push(personName);
        days
          .filter((day) => day !== selectedDay)
          .forEach((day) => {
            const otherDayKey = `${selectedTask.name}-${day}`;
            updatedSelections[otherDayKey] = updatedSelections[
              otherDayKey
            ].filter((name) => name !== personName);
          });
      } else {
        updatedSelections[key] = updatedSelections[key].filter(
          (name) => name !== personName
        );
      }
    }

    setSelections(updatedSelections);
  };

  const handleDeselectPerson = (personName, selectionKey) => {
    const updatedSelections = { ...selections };
    updatedSelections[selectionKey] = updatedSelections[selectionKey].filter(
      (name) => name !== personName
    );
    setSelections(updatedSelections);
  };

  const handleClearNames = (taskName) => {
    const updatedSelections = { ...selections };
    days.forEach((day) => {
      updatedSelections[`${taskName}-${day}`] = [];
    });
    setSelections(updatedSelections);
  };

  const renderModal = () => {
    
    const oppositeTask = selectedTask.name === "Cuisine" ? "Nettoyage" : selectedTask.name === "Nettoyage" ? "Cuisine" : null;
    const isSAVTask = SAV_TASKS.includes(selectedTask.name);

    let eligiblePersons = persons.filter((person) => {
        // Exclure les personnes absentes pour le jour sélectionné
        if (selections[`Absents-${selectedDay}`]?.includes(person.name)) {
            return false;
        }

        // Vérifier que la personne a la tâche attribuée dans ses tâches disponibles
    if (!person.tasks.includes(selectedTask.name)) {
      return false;
    }

        // Exclure les personnes déjà assignées à un autre créneau S.A.V. sur le même jour
        if (isSAVTask) {
          return !SAV_TASKS.some((taskName) => {
            return taskName !== selectedTask.name && selections[`${taskName}-${selectedDay}`]?.includes(person.name);
          });
        }

        // Pour "Cuisine" et "Nettoyage", exclure les personnes assignées à la tâche opposée sur le même jour
        if (oppositeTask && selections[`${oppositeTask}-${selectedDay}`]?.includes(person.name)) {
            return false;
        }

        // Pour les autres tâches, s'assurer que la personne n'est pas déjà assignée à cette tâche sur un autre jour (sauf pour "Toute la semaine")
        if (selectedDay !== "Toute la semaine" && days.some(day => selections[`${selectedTask.name}-${day}`]?.includes(person.name))) {
            return false;
        }

        // S'assurer que la personne est éligible pour la tâche sélectionnée (pour les tâches autres que "Absents")
        if (selectedTask.name !== "Absents" && !selectedTask.persons.includes(person.name)) {
            return false;
        }

        return true;
    });

    return (
      <div className="modal-overlay">
        <div className="modal">
          <span className="close-button" onClick={handleCloseModal}>
            &times;
          </span>
          <h2>
            Sélection pour {selectedTask?.name} - {selectedDay}
          </h2>
          {eligiblePersons.map((person) => {
            const isChecked =
              selections[`Absents-Toute la semaine`]?.includes(person.name) ||
              selections[`${selectedTask.name}-${selectedDay}`]?.includes(
                person.name
              );
            return (
              <div key={person.name} className="modal-name">
                <input
                  type="checkbox"
                  id={`modal-${person.name}`}
                  checked={isChecked}
                  onChange={(e) =>
                    handleSelectionChange(person.name, e.target.checked)
                  }
                />
                <label htmlFor={`modal-${person.name}`}>{person.name}</label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTaskTable = () => {
    if (showSimplifiedView) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Tâches / Jours</th>
              {days.filter(day => day !== "Toute la semaine").map((day) => (
                <th style={{ width: "10%" }} key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {tasks.filter(task => task.name !== "Absents").map((task) => (
  <tr key={task.name}>
    <td>{task.name}</td>
    {days.filter(day => day !== "Toute la semaine").map((day) => (
      <td key={`${task.name}-${day}`} className={selections[`${task.name}-${day}`]?.length ? "" : "empty-cell"}>
        {task.days.includes(day) && selections[`${task.name}-${day}`]?.length ? (
          <div>
            {selections[`${task.name}-${day}`]?.join(" / ")}
          </div>
        ) : null }
      </td>
    ))}
  </tr>
))}
          </tbody>
        </table>
      );
    } else {
    return (
      <table>
        <thead>
          <tr>
            <th>Tâches / Jours</th>
            <th style={{ width: "5%" }}>Tout Décocher</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.name}>
              <td>
                <div>{task.name}</div>
              </td>
              <td>
                <div>
                  <span
                    className="deselect-button"
                    onClick={() => handleClearNames(task.name)}
                  >
                    &#10005;
                  </span>
                </div>
              </td>
              {days.map((day) => (
                <td style={{ width: "9.5%" }} key={`${task.name}-${day}`}>
                  {day === "Toute la semaine" || task.days.includes(day) ? (
                    <>
                      <button
                        className="button-add"
                        onClick={() => handleOpenModal(task, day)}
                      >
                        +
                      </button>
                      <div>
                        {selections[`${task.name}-${day}`]?.map((name) => (
                          <div key={name}>
                            {name}
                            <span
                              className="deselect-button"
                              onClick={() =>
                                handleDeselectPerson(
                                  name,
                                  `${task.name}-${day}`
                                )
                              }
                            >
                              &#10005;
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

return (
  <div className="task-planner">
    <div className="task-planner-header">
      <h1>Planning Helper</h1>
      <div>
        <label htmlFor="start-date">Choisir la semaine du: </label>
        <input
          type="date"
          id="start-date"
          className="date-input"
          onChange={handleDateChange}
        />
      </div>
      <button className="bouton-vue-tableau" onClick={toggleView}>
        {showSimplifiedView ? "Afficher la vue détaillée" : "Afficher la vue simplifiée"}
      </button>
    </div>
    {selectedDateRange && (
      <p className="date-display">
        Semaine du {selectedDateRange}
      </p>
    )}
    {renderTaskTable()}
    {showModal && renderModal()}
  </div>
);
};

export default TaskPlanner;
