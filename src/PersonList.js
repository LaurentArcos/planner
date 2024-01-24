import React, { useState } from "react";
import personsData from "./persons";
import tasksData from "./tasks";

const PersonList = ({ onSelectionDone }) => {
  const initialSelections = personsData.reduce((acc, person) => {
    acc[person.name] = {
      roles: new Set(person.tasks),
      absentDays: person.availableDays,
    };
    return acc;
  }, {});
  
  const [selections, setSelections] = useState(initialSelections);
  const [ponctualAbsences, setPonctualAbsences] = useState({
    LUNDI: new Set(),
    MARDI: new Set(),
    MERCREDI: new Set(),
    JEUDI: new Set(),
    VENDREDI: new Set(),
    SAMEDI: new Set(),
    DIMANCHE: new Set()
  });

  const [showModal, setShowModal] = useState(false);
  const [tempSelections, setTempSelections] = useState(new Set());
  const [selectedDay, setSelectedDay] = useState(null);
  const days = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];

  const openModal = (day) => {
    setTempSelections(new Set(ponctualAbsences[day]));
    setSelectedDay(day); 
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };

  const handleRoleChange = (personName, role) => {
    const updatedSelections = { ...selections };
    const personData = updatedSelections[personName];

    if (role === "Absents") {
      if (personData.roles.has(role)) {
        
        personData.roles.delete(role);
      } else {
        
        personData.roles.clear();
        personData.roles.add("Absents");
      }
    } else {
      if (personData.roles.has("Absents")) {
        
        return;
      }
      if (personData.roles.has(role)) {
        personData.roles.delete(role);
      } else {
        personData.roles.add(role);
      }
    }

    setSelections(updatedSelections);
  };


  const handlePonctualAbsenceChange = (day, selectedPersons) => {
    console.log(`Day: ${day}, Selected Persons: ${selectedPersons}`);
    setPonctualAbsences(prevAbsences => ({
      ...prevAbsences,
      [day]: new Set(selectedPersons)
    }));
  };

  const handlePonctualAbsenceSelection = (day, event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setPonctualAbsences(prevAbsences => ({
      ...prevAbsences,
      [day]: new Set(selectedOptions)
    }));
  };

  const handleSubmit = () => {
    onSelectionDone(selections);
  };

  const handleTempSelectionChange = (e) => {
    const value = e.target.value;
    setTempSelections((prev) =>
      new Set(prev.has(value) ? [...prev].filter((name) => name !== value) : [...prev, value])
    );
  
    // Mettez à jour les absences exceptionnelles dans ponctualAbsences
    handlePonctualAbsenceChange(selectedDay, Array.from(tempSelections));
  };
  
  const confirmSelection = () => {
    console.log("Confirming Selection");
    handlePonctualAbsenceChange(selectedDay, Array.from(tempSelections));
    closeModal();
  };

  return (
    <div className="person-list">
      <div className="row header-row">
        <div className="column">Personne</div>
        {tasksData.map((task) => (
          <div className="column" key={task.name}>{task.name}</div>
        ))}
      </div>
  
      {personsData.map((person) => (
        <div
          className={`row ${selections[person.name].roles.has("Absents") ? "row-absents" : ""}`}
          key={person.name}
        >
          <div className="column-name">{person.name}</div>
          {tasksData.map((task) => (
            <div className="column" key={task.name}>
              <input
                type="checkbox"
                className="checkbox"
                id={`${person.name}-${task.name}`}
                checked={selections[person.name].roles.has(task.name)}
                onChange={() => handleRoleChange(person.name, task.name)}
                disabled={task.name !== "Absents" && selections[person.name].roles.has("Absents")}
              />
              <label htmlFor={`${person.name}-${task.name}`} className={`checkbox-label ${task.name !== "Absents" && selections[person.name].roles.has("Absents") ? "disabled" : ""}`}></label>
            </div>
          ))}
        </div>
      ))}
  
      <div className="absence-row">
        <div className="column">Absences Ponctuelles</div>
        {days.map((day) => (
  <div className="column" key={day}>
    <button className="button-absence" onClick={() => openModal(day)}>{day}</button>
            <div>
        {Array.from(ponctualAbsences[day] || []).map(name => (
          <div key={name}>{name}</div>
        ))}
      </div>
          </div>

        ))}
      </div>
  
      <button onClick={handleSubmit}>Valider</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>Sélectionner les absences ponctuelles pour {selectedDay}</h2>
            {personsData.map(person => (
              
              !selections[person.name].roles.has("Absents") ? (
                <div key={person.name}>
                  <input
                    type="checkbox"
                    id={`temp-${person.name}`}
                    value={person.name}
                    checked={tempSelections.has(person.name)}
                    onChange={handleTempSelectionChange}
                  />
                  <label htmlFor={`temp-${person.name}`}>{person.name}</label>
                </div>
              ) : null
            ))}
            <button className="button-valider" onClick={confirmSelection}>Confirmer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonList;