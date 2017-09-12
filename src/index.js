import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './styles/index.css';
import './styles/bootstrap.min.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
document.getElementById('root'));
registerServiceWorker();
