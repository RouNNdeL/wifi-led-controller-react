import {DevicesActionType, DevicesState, SET_DEVICES, UPDATE_DEVICE, WS_MESSAGE, WS_OPEN, WsActionType} from "./types";
import {BinarySerializer} from "../../utils/BinarySerializer";

const initialState: DevicesState = {
  devices: [{
    name: "Onboard LED",
    index: 0,
    state: false,
    brightness: 0x20,
    color: "#ff00ff"
  },{
    name: "Part1",
    index: 1,
    state: false,
    brightness: 0x20,
    color: "#ff00ff"
  },{
    name: "Part2",
    index: 2,
    state: false,
    brightness: 0x20,
    color: "#ff00ff"
  }],
  requestQueue: [],
  responseQueue: []
};

export function devicesReducer(state = initialState, action: WsActionType | DevicesActionType) {
  switch (action.type) {
    case WS_OPEN:
      return state;
    case WS_MESSAGE:
      const blob : Blob = action.payload.message;
      blob.arrayBuffer().then((value => console.log(BinarySerializer.getPayloadFromBinary(value))));
      // TODO: Add async dispatch middleware to then dispatch
      //  to handle resolved array buffer and add to response queue
      return state;
    case UPDATE_DEVICE:
      return {
        ...state, devices: state.devices.map(d => d.index === action.device.index ? action.device : d)
      };
    case SET_DEVICES:
      return {
        ...state, devices: action.devices
      };
    default:
      return state;
  }
}