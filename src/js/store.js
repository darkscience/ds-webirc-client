import appReducer from './reducers/app';
import { createStore } from 'redux';

const store = createStore(appReducer);

export default store;
