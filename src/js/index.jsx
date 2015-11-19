import React from 'react';
import { render } from 'react-dom';
import { sock } from './wiring';
import store from './store';
import { Provider } from 'react-redux';
import App from './components/App';

sock.on('connect', () => {
  sock.emit('register', store.getState().get('nick'));
});

render(<Provider store={store}>
  <App />
</Provider>, document.getElementById("app"));
