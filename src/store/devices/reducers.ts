import {DevicesState} from "./types";
import {Action as WsAction} from "@giantmachines/redux-websocket/dist/types";
import {DEFAULT_PREFIX} from "@giantmachines/redux-websocket/dist";

const initialState: DevicesState = {
  devices: []
};

export function devicesReducer(state = initialState, action: WsAction) {
  switch (action.type) {
    case `${DEFAULT_PREFIX}::OPEN`:
      return {
        ...state, devices: [{
          state: 1,
          brightness: 255,
          color: "#ff00ff"
        }]
      };
    case  `${DEFAULT_PREFIX}::MESSAGE`:
      console.log(action.payload);
      return state;
    default:
      return state;
  }
}