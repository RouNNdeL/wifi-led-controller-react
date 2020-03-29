import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./App";
import {Provider} from "react-redux";
import {applyMiddleware, createStore, Middleware} from "redux";
import rootReducer from "./store";
import {composeWithDevTools} from "redux-devtools-extension";
import reduxWebsocket from '@giantmachines/redux-websocket';

const initialState = {};

const reduxWebsocketMiddleware = reduxWebsocket({
  onOpen: socket => socket.binaryType = "arraybuffer"
});

const middleware: Middleware[] = [reduxWebsocketMiddleware];
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