// frontend/src/App.js
import React, { useState }  from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Composants de react-router-dom pour gérer le routage.
import Home from './components/Home/Home';
import Quiz from './components/quiz/Quiz';
//import Comptabilite from './components/Comptabilite';
//import Storyboard from './components/Storyboard';
//import Scenario from './components/Scenario';
// import './components/quiz/quiz.css'; // Importer le CSS de quizz -plus necessaire avec l'import dynamique

// Objet de configuration pour les routes
const routes = [ //
  { path: '/', component: Home, exact: true }, // Route pour le composant Quiz rendue en premier parce que exact est true
  { path: '/home', component: Home },
  { path: '/quiz', component: Quiz }
 // { path: '/planning', component: Planning },
 // { path: '/comptabilite', component: Comptabilite },
 // { path: '/storyboard', component: Storyboard },
 // { path: '/scenario', component: Scenario },
 // { path: '/diagram', component: Diagram },
];

function App() {

  //----------------------------------------------
  // const [showQuiz, setShowQuiz] = useState(false); // Utilisation de useState pour gérer l'état du composant Quiz
  // lance le scritp du composant Quiz a l'interieur de App si le bouton est cliqué
  const [showQuiz, setShowQuiz] = useState(false);

  const handleShowQuiz = () => {
    setShowQuiz(true);
  };

  const handleHideQuiz = () => {
    setShowQuiz(false);
  };

  //---------------------------------------------
  return (
    <Router>
      {/* Créer une barre de navigation pour basculer entre les composants Home et Quiz */}
      <div>
        <nav>
          <button onClick={handleHideQuiz}>Home</button>
          <button onClick={handleShowQuiz}>Quiz</button>
        </nav>
        {showQuiz ? <Quiz /> : <Home />} {/* Afficher le composant Quiz si showQuiz est vrai, sinon afficher le composant Home */}
      </div>
     {/* Créer un système de !! routage !! pour basculer entre les composants Home et Quiz */}
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        ))}
      </Switch>
    </Router>
  );
}

export default App; // Exporter le composant App pour l'utiliser dans index.js