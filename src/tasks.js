import persons from './persons'; // Assurez-vous que le chemin est correct

const tasks = [
  {
    name: "Absents",
    persons: persons.filter(person => person.tasks.includes("Absents")).map(person => person.name),
    group: "",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]
  },
  {
    name: "Cuisine",
    persons: persons.filter(person => person.tasks.includes("Cuisine")).map(person => person.name),
    group: "Quotidien",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "Nettoyage",
    persons: persons.filter(person => person.tasks.includes("Nettoyage")).map(person => person.name),
    group: "Quotidien",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "S.A.V. (8h-16h)",
    persons: persons.filter(person => person.tasks.includes("S.A.V. (8h-16h)")).map(person => person.name),
    group: "S.A.V.",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "S.A.V. (9h-17h)",
    persons: persons.filter(person => person.tasks.includes("S.A.V. (9h-17h)")).map(person => person.name),
    group: "S.A.V.",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "S.A.V. (11h-19h)",
    persons: persons.filter(person => person.tasks.includes("S.A.V. (11h-19h)")).map(person => person.name),
    group: "S.A.V.",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "Astreinte Prestataires / Repassage",
    persons: persons.filter(person => person.tasks.includes("Astreinte Prestataires / Repassage")).map(person => person.name),
    group: "Logistique",
    days: ["MERCREDI"]
  },
  {
    name: "Pilote Session",
    persons: persons.filter(person => person.tasks.includes("Pilote Session")).map(person => person.name),
    group: "Logistique",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
  },
  {
    name: "Boutique Toulon",
    persons: persons.filter(person => person.tasks.includes("Boutique Toulon")).map(person => person.name),
    group: "Retail",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"]
  },
  {
    name: "Boutique Paris",
    persons: persons.filter(person => person.tasks.includes("Boutique Paris")).map(person => person.name),
    group: "Retail",
    days: ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]
  }
];

export default tasks;
