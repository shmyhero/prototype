// @flow

// Redux Store Configuration
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import loggingMiddleware from './middleware/logging';

// const configureStore = (initialState: Object) => {
//     const middleware = applyMiddleware(thunk, loggingMiddleware);

//     return createStore(rootReducer, initialState, middleware);
// };

// export default configureStore;

export function configureStore() {
    let store = createStore(rootReducer, applyMiddleware(thunk, loggingMiddleware));
 
    //Crash!!!!
    // if (module.hot) { 
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept('../reducers', () => {
    //         const nextRootReducer = require('../reducers');
    //         store.replaceReducer(nextRootReducer);
    //     });
    // }

    return store
}

//export const store = configureStore();