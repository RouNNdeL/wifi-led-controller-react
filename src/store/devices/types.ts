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
export const INCREMENT_PACKET_ID = "INCREMENT_PACKET_ID";

export const REQUEST_PAYLOAD_SAVE_DEVICE = "REQUEST_PAYLOAD_SAVE_DEVICE";
export const REQUEST_PAYLOAD_GET_DEVICE = "REQUEST_PAYLOAD_GET_DEVICE";
export const REQUEST_PAYLOAD_GET_ALL_DEVICES = "REQUEST_PAYLOAD_GET_ALL_DEVICES";

export const RESPONSE_PAYLOAD_SAVE_DEVICE = "RESPONSE_PAYLOAD_SAVE_DEVICE";
export const RESPONSE_PAYLOAD_GET_DEVICE = "RESPONSE_PAYLOAD_GET_DEVICE";
export const RESPONSE_PAYLOAD_GET_ALL_DEVICES = "RESPONSE_PAYLOAD_GET_ALL_DEVICES";
export const RESPONSE_PAYLOAD_ERROR = "RESPONSE_PAYLOAD_ERROR";

export interface Device {
  name: string;
  index: number;
  state: boolean;
  brightness: number;
  color: string;
}

export interface PayloadSaveDeviceRequest {
  type: typeof REQUEST_PAYLOAD_SAVE_DEVICE;
  device: Device;
}

export interface PayloadSaveDeviceResponse {
  type: typeof RESPONSE_PAYLOAD_SAVE_DEVICE;
}

export interface PayloadErrorResponse {
  type: typeof RESPONSE_PAYLOAD_ERROR;
  identifier: number
}

export type RequestPayload = PayloadSaveDeviceRequest;

export type ResponsePayload = PayloadSaveDeviceResponse | PayloadErrorResponse;

export interface DevicesState {
  devices: Device[];
  clientId: number | null;
  packetId: number;
  requestQueue: RequestPayload[];
  responseQueue: ResponsePayload[];
}

export interface UpdateDevice {
  type: typeof UPDATE_DEVICE;
  device: Device;
}

export interface SetDevices {
  type: typeof SET_DEVICES;
  devices: Device[];
}

export interface WsConnect {
  type: typeof WS_CONNECT;
  payload: any;
}

export interface WsOpen {
  type: typeof WS_OPEN;
  payload: any;
}

export interface WsError {
  type: typeof WS_ERROR;
  payload: any;
}

export interface WsMessage {
  type: typeof WS_MESSAGE;
  payload: any;
}

export interface IncrementPacketId {
  type: typeof INCREMENT_PACKET_ID,
}


export type DevicesActionType = UpdateDevice | SetDevices | IncrementPacketId

export type WsActionType = WsConnect | WsOpen | WsError | WsMessage