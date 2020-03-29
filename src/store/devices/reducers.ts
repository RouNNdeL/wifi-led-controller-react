import {
  DevicesActionType,
  DevicesState,
  INCREMENT_PACKET_ID,
  SET_DEVICES,
  UPDATE_DEVICE,
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
  }, {
    name: "Part1",
    index: 1,
    state: false,
    brightness: 0x20,
    color: "#ff00ff"
  }, {
    name: "Part2",
    index: 2,
    state: false,
    brightness: 0x20,
    color: "#ff00ff"
  }],
  clientId: null,
  packetId: 0,
  requestQueue: [],
  responseQueue: []
};

export function devicesReducer(state = initialState, action: WsActionType | DevicesActionType) {
  switch (action.type) {
    case WS_OPEN:
      return state;
    case WS_MESSAGE:
      const array: Uint8Array = new Uint8Array(action.payload.message);
      if (state.clientId == null) {
        if (array.length != 1) {
          throw new Error("First message expected clientId");
        }
        return {...state, clientId: array[0]}
      }

      // TODO: Parse responses
      return state;
    case UPDATE_DEVICE:
      return {
        ...state, devices: state.devices.map(d => d.index === action.device.index ? action.device : d)
      };
    case SET_DEVICES:
      return {
        ...state, devices: action.devices
      };
    case INCREMENT_PACKET_ID:
      return {...state, packetId: state.packetId + 1};
    default:
      return state;
  }
}