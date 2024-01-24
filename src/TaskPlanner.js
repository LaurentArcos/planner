import React, { useState, useEffect } from 'react';
import personsData from './persons'; // Assurez-vous que le chemin est correct
import tasksData from './tasks'; // Assurez-vous que le chemin est correct

const TaskPlanner = () => {
    const [tasks, setTasks] = useState(tasksData);
    const [persons, setPersons] = useState(personsData);
    const [selections, setSelections] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const days = ["Toute la semaine", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

    useEffect(() => {
      // Initialisation des sélections en tant que tableaux vides
      let initialSelections = {};
      tasks.forEach(task => {
          days.forEach(day => {
              initialSelections[`${task.name}-${day}`] = [];
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

    const handleSelectionChange = (personName, isChecked) => {
        const key = `${selectedTask.name}-${selectedDay}`;
        let updatedSelections = selections[key] ? [...selections[key]] : [];
        if (isChecked) {
            updatedSelections.push(personName);
        } else {
            updatedSelections = updatedSelections.filter(name => name !== personName);
        }
        setSelections({ ...selections, [key]: updatedSelections });
    };

    const renderModal = () => {
      const eligiblePersons = selectedTask.name === "Absents" 
          ? persons 
          : persons.filter(person => selectedTask.persons.includes(person.name));
  
      return (
          <div className="modal-overlay">
              <div className="modal">
                  <span className="close-button" onClick={handleCloseModal}>&times;</span>
                  <h2>Sélection pour {selectedTask?.name} - {selectedDay}</h2>
                  {eligiblePersons.map(person => (
                      <div key={person.name}>
                          <input
                              type="checkbox"
                              id={`modal-${person.name}`}
                              checked={selections[`${selectedTask.name}-${selectedDay}`]?.includes(person.name)}
                              onChange={(e) => handleSelectionChange(person.name, e.target.checked)}
                          />
                          <label htmlFor={`modal-${person.name}`}>{person.name}</label>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

    const renderTaskTable = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Tâches / Jours</th>
                        {days.map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.name}>
                            <td>{task.name}</td>
                            {days.map(day => (
                                <td key={`${task.name}-${day}`}>
                                    <button onClick={() => handleOpenModal(task, day)}>Sélectionner</button>
                                    <div>
                                        {selections[`${task.name}-${day}`]?.map(name => <div key={name}>{name}</div>)}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="task-planner">
            <h1>Planificateur de Tâches</h1>
            {renderTaskTable()}
            {showModal && renderModal()}
        </div>
    );
};

export default TaskPlanner;
