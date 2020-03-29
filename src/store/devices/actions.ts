import {Device, DevicesActionType, SET_DEVICES, UPDATE_DEVICE} from "./types";


export function updateDevice(device: Device): DevicesActionType {
  return {
    type: UPDATE_DEVICE,
    device: device
  }
}

export function setDevices(devices: Device[]): DevicesActionType {
  return {
    type: SET_DEVICES,
    devices: devices
  }
}