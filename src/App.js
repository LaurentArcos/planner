import React, { useState } from 'react';
import PersonList from './PersonList';
import WeekPlanner from './WeekPlanner';

const App = () => {
  const [page, setPage] = useState('personList');
  const [selections, setSelections] = useState({});

  const handleSelectionDone = (selectedRoles) => {
    setSelections(selectedRoles);
    setPage('weekPlanner');
  };

  return (
    <div>
      {page === 'personList' && <PersonList onSelectionDone={handleSelectionDone} />}
      {page === 'weekPlanner' && <WeekPlanner selections={selections} />}
    </div>
  );
};

export default App;