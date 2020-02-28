import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';

import history from './history';

import Analyse from './ui/views/Analyse/index.jsx';
import Home from './ui/views/Home/index.jsx';
import Help from './ui/views/Help/index.jsx';
import Login from './ui/views/Login/index.jsx';

import * as serviceWorker from './serviceWorker';

const routing = (
    <Router history={history}>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/analyse" component={Analyse} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/help" component={Help} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
