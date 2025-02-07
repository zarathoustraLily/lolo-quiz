import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Home from '../Home/Home';
import Quiz from '../quiz/Quiz';
import './App.css';
import './App-mobile.css';

const App = () => {
  const { deviceType } = useTheme();
  const history = useHistory();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    setShowMenu(location.pathname === '/');
  }, [location]);

  const handleHomeClick = () => {
    history.push('/home');
  };
    
  const handleQuizClick = () => {
    history.push('/quiz');
  };

  return (
    <div className={`App ${deviceType === 'mobile' ? 'App-mobile' : 'App-desktop'}`}>
      {showMenu && (
        <div className="main-menu">
          <h1>Choose an Application</h1>
          <p>This is a {deviceType} view.</p>
          <div className="button-container">
            <button onClick={handleHomeClick}>
              <span>Home</span>
            </button>
            <button onClick={handleQuizClick}>
              <span>Quiz</span>
            </button>
          </div>
        </div>
      )}
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/quiz" component={Quiz} />
      </Switch>
    </div>
  );
};

export default App;