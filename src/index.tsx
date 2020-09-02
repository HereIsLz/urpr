import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

import createHistory from 'history/createHashHistory';
import { Router, Route } from 'react-router-dom';
import { initializeIcons } from '@uifabric/icons';
import { loadTheme } from '@fluentui/react';
import { registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { useBoolean } from '@uifabric/react-hooks'
import { theme } from './configs/theme';

//const history = createHistory();
loadTheme(theme)
initializeIcons()

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
