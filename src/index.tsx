import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import {Provider} from "react-redux";
import {AnyAction, applyMiddleware, createStore, Dispatch, Middleware, Store} from "redux";
import rootReducer from "./store";
import {composeWithDevTools} from "redux-devtools-extension";
import reduxWebsocket from '@giantmachines/redux-websocket';

const initialState = {};

const asyncDispatchMiddleware = (store: Store) => (next: Dispatch) => (action: AnyAction) => {
  let syncActivityFinished = false;
  let actionQueue: AnyAction[] = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction: AnyAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch =
    Object.assign({}, action, {asyncDispatch});

  const res = next(actionWithAsyncDispatch);

  syncActivityFinished = true;
  flushQueue();

  return res;
};

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: socket => socket.binaryType = "arraybuffer"
});

const middleware: Middleware[] = [reduxWebsocketMiddleware, asyncDispatchMiddleware];
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.querySelector("#app"));