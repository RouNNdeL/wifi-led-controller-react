const GET_DEVICES = "GET_DEVICES";

export interface Device {
  state: number;
  brightness: number;
  color: string;
}

export interface DevicesState {
  devices: Device[]
}