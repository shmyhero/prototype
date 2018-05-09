// @flow
import { combineReducers } from 'redux';
import balanceReducer from './balanceReducer';
import meDataReducer from './meDataReducer';
import followReducer from './followReducer';

// Root Reducer
const rootReducer = combineReducers({
  balance: balanceReducer,
  meData: meDataReducer,
  follow: followReducer,
});

export default rootReducer;