import React, { useState } from "react";

const roles = [
  "Cuisine",
  "Nettoyage",
  "S.A.V. (8h-16h)",
  "S.A.V. (11h-19h)",
  "S.A.V. (9h-17h)",
  "Astreinte Prestataires / Repassage",
  "Pilote Session",
  "Boutique Toulon",
  "Boutique Paris",
  "Absent"
];

const personNames = [
  "Bertrand",
  "Capucine",
  "Elino",
  "Florian",
  "Hugo",
  "Laurent",
  "Lorenzo",
  "Lucas",
  "Lucie",
  "Margot",
  "Marie",
  "Mathis",
  "Matthieu",
  "Nolan",
  "Oualid",
  "Pierre",
  "Quentin",
  "Quentus",
  "Rémi",
  "Tatiana",
  "Nathaniel",
  "Yoann"
];

const PersonList = ({ onSelectionDone }) => {
  const initialSelections = {
    Bertrand: new Set(["Absent"]),
    Capucine: new Set(["S.A.V. (8h-16h)","S.A.V. (11h-19h)","S.A.V. (9h-17h)"]),
    Elino: new Set([""]),
    Florian: new Set(["Cuisine", "Nettoyage", "S.A.V. (8h-16h)","S.A.V. (11h-19h)","S.A.V. (9h-17h)"]),
    Hugo: new Set(["S.A.V. (8h-16h)","S.A.V. (11h-19h)","S.A.V. (9h-17h)"]),
    Laurent: new Set(["Cuisine", "Nettoyage"]),
    Lorenzo: new Set(["Boutique Toulon"]),
    Lucas: new Set([""]),
    Lucie: new Set([""]),
    Margot: new Set(["Cuisine", "Nettoyage"]),
    Marie: new Set(["Cuisine", "Nettoyage"]),
    Mathis: new Set(["Cuisine", "Nettoyage"]),
    Matthieu: new Set(["Absent"]),
    Nolan: new Set(["Boutique Toulon"]),
    Oualid: new Set([""]),
    Pierre: new Set([""]),
    Quentin: new Set([""]),
    Quentus: new Set(["Cuisine", "Nettoyage"]),
    Rémi: new Set(["Cuisine", "Nettoyage"]),
    Tatiana: new Set(["Boutique Paris"]),
    Nathaniel: new Set(["Boutique Paris"]),
    Yoann: new Set(["Boutique Paris"])
  };

  const [selections, setSelections] = useState(initialSelections);

  const handleRoleChange = (person, role) => {
    const updatedSelections = { ...selections };

    if (!updatedSelections[person]) {
      updatedSelections[person] = new Set();
    }

    if (role === "Absent") {
      if (updatedSelections[person].has(role)) {
        updatedSelections[person].clear();
      } else {
        updatedSelections[person] = new Set(["Absent"]);
      }
    } else {
      if (updatedSelections[person].has("Absent")) {
        return; 
      }
      if (updatedSelections[person].has(role)) {
        updatedSelections[person].delete(role);
      } else {
        updatedSelections[person].add(role);
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
        {roles.map((role) => (
          <div className="column" key={role}>
            {role}
          </div>
        ))}
      </div>
      {personNames.map(person => (
      <div className={`row ${selections[person]?.has("Absent") ? "row-absent" : ""}`} key={person}>
        <div className="column-name">{person}</div>
        {roles.map(role => (
          <div className="column" key={role}>
            <input
              type="checkbox"
              className="checkbox"
              id={`${person}-${role}`}
              checked={!!selections[person]?.has(role)}
              onChange={() => handleRoleChange(person, role)}
              disabled={role !== "Absent" && selections[person]?.has("Absent")}
            />
            <label
              htmlFor={`${person}-${role}`}
              className={`checkbox-label ${role !== "Absent" && selections[person]?.has("Absent") ? "disabled" : ""}`}
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
