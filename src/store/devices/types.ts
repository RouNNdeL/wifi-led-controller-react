export const WS_BEGIN_RECONNECT = `REDUX_WEBSOCKET::BEGIN_RECONNECT`;
export const WS_RECONNECT_ATTEMPT = `REDUX_WEBSOCKET::RECONNECT_ATTEMPT`;
export const WS_RECONNECTED = `REDUX_WEBSOCKET::RECONNECTED`;
export const WS_BROKEN = `REDUX_WEBSOCKET::BROKEN`;
export const WS_CLOSED = `REDUX_WEBSOCKET::CLOSED`;
export const WS_ERROR = `REDUX_WEBSOCKET::ERROR`;
export const WS_MESSAGE = `REDUX_WEBSOCKET::MESSAGE`;
export const WS_OPEN = `REDUX_WEBSOCKET::OPEN`;
export const WS_CONNECT = `REDUX_WEBSOCKET::CONNECT`;
export const WS_DISCONNECT = `REDUX_WEBSOCKET::DISCONNECT`;
export const WS_SEND = `REDUX_WEBSOCKET::SEND`;


export const UPDATE_DEVICE = "UPDATE_DEVICE";
export const SET_DEVICES = "SET_DEVICES";

export interface Device {
  name: string;
  index: number;
  state: boolean;
  brightness: number;
  color: string;
}

export interface DevicesState {
  devices: Device[]
}

export interface UpdateDevice {
  type: typeof UPDATE_DEVICE;
  device: Device
}

export interface SetDevices {
  type: typeof SET_DEVICES;
  devices: Device[]
}

export interface WsConnect {
  type: typeof WS_CONNECT,
  payload: any
}

export interface WsOpen {
  type: typeof WS_OPEN,
  payload: any
}

export interface WsError {
  type: typeof WS_ERROR,
  payload: any
}

export interface WsMessage {
  type: typeof WS_MESSAGE,
  payload: any
}

export type DevicesActionType = UpdateDevice | SetDevices

export type WsActionType = WsConnect | WsOpen | WsError | WsMessage