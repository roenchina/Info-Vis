import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import {StateProvider} from "./store";


ReactDOM.render(
  <StateProvider>
    <App/>
  </StateProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
