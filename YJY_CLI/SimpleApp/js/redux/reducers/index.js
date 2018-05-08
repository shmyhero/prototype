// @flow
import { combineReducers } from 'redux';
import balanceReducer from './balanceReducer';
import meDataReducer from './meDataReducer';
import checkLoginReducer from './checkLoginReducer';
import followReducer from './followReducer';

// Root Reducer
const rootReducer = combineReducers({
  checkLogin: checkLoginReducer,
  balance: balanceReducer,
  meData: meDataReducer,
  follow: followReducer,
});

export default rootReducer;