import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import * as reducer from "./reducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import { sessionService } from 'redux-react-session';

const store = configureStore({});

function configureStore(initialState) {

  return createStore(
    reducer.rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );
}

sessionService.initSessionService(store);

export default store;

