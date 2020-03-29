import {
  DevicesActionType,
  DevicesState,
  UPDATE_DEVICE,
  SET_DEVICES,
  WS_MESSAGE,
  WS_OPEN,
  WsActionType
} from "./types";

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
  }]
};

export function devicesReducer(state = initialState, action: WsActionType | DevicesActionType) {
  switch (action.type) {
    case WS_OPEN:
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