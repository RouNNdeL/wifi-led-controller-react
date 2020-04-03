import {
  ADD_REQUEST, Device,
  DevicesActionType,
  DevicesState,
  RESPONSE_PAYLOAD_GET_ALL_DEVICES,
  SET_DEVICES,
  UPDATE_DEVICE,
  WS_MESSAGE,
  WS_OPEN,
  WsActionType
} from "./types";
import {BinarySerializer} from "../../utils/BinarySerializer";

const initialState: DevicesState = {
  devices: [],
  deviceDefinitions: [{name: "Top", index: 2}, {name: "Bottom", index: 1}],
  clientId: null,
  packetId: 0,
  lastRequest: null,
  packetTimeout: null,
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

      const response = BinarySerializer.getPayloadFromBinary(array.buffer, state.clientId);
      if (response == null) {
        return state;
      }

      switch (response.type) {
        case RESPONSE_PAYLOAD_GET_ALL_DEVICES:
          const devices: Device[] = state.deviceDefinitions.map(v => {
            const device: Device = response.devices.filter(d => d.index === v.index)[0];
            return {...device, name: v.name}
          });

          return {
            ...state, devices
          }
      }

      return state;
    case UPDATE_DEVICE:
      return {
        ...state, devices: state.devices.map(d => d.index === action.device.index ? action.device : d)
      };
    case SET_DEVICES:
      return {
        ...state, devices: action.devices
      };
    case ADD_REQUEST:
      return {...state, packetId: state.packetId + 1, lastRequest: action.request};
    default:
      return state;
  }
}