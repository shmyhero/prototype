// @flow
import { combineReducers } from 'redux';
import balanceReducer from './balanceReducer';
import meDataReducer from './meDataReducer';
import followReducer from './followReducer';
import settingsReducer from './settingsReducer';
import messageReducer from './messageReducer';

// Root Reducer
const rootReducer = combineReducers({
  balance: balanceReducer,
  meData: meDataReducer,
  follow: followReducer,
  settings: settingsReducer,
  message: messageReducer
});

export default rootReducer;