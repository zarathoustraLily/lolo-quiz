// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './components/App/App';
import { ThemeProvider } from './context/ThemeContext';

function Main() {
  return (
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  );
}

ReactDOM.render(
  <ThemeProvider>
    <Router>
      <Main />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);

// index.js rend App et l'injecte dans le DOM, pour le rendre et l'enregistrer dans la div avec l'id root dans index.html