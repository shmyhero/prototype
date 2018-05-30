// @flow
import { combineReducers } from 'redux';
import balanceReducer from './balanceReducer';
import meDataReducer from './meDataReducer';
import followReducer from './followReducer';
import settingsReducer from './settingsReducer';

// Root Reducer
const rootReducer = combineReducers({
  balance: balanceReducer,
  meData: meDataReducer,
  follow: followReducer,
  settings: settingsReducer,
});

export default rootReducer;