import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  const handleOnboardingComplete = (name) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  return (
    <div className="app">
      {!userName ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard userName={userName} />
      )}
    </div>
  );
}

export default App;
