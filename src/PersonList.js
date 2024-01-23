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

  const handleRoleChange = (person, role) => {
    const updatedSelections = { ...selections };
    const personData = updatedSelections[person];

    if (role === "Absents") {
      if (personData.roles.has(role)) {
        personData.roles.clear();
      } else {
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

  const handleSubmit = () => {
    console.log("Final selections:", selections);
    onSelectionDone(selections);
  };

  return (
    <div className="person-list">
      <div className="row header-row">
        <div className="column">Personne</div>
        {tasksData.map((task) => (
          <div className="column" key={task.name}>
            {task.name}
          </div>
        ))}
      </div>
      {personsData.map((person) => (
        <div
          className={`row ${
            selections[person.name].roles.has("Absents") ? "row-absents" : ""
          }`}
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
                disabled={
                  task.name !== "Absents" &&
                  selections[person.name].roles.has("Absents")
                }
              />
              <label
                htmlFor={`${person.name}-${task.name}`}
                className={`checkbox-label ${
                  task.name !== "Absents" &&
                  selections[person.name].roles.has("Absents")
                    ? "disabled"
                    : ""
                }`}
              ></label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Valider</button>
    </div>
  );
};

export default PersonList;