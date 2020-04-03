import {ADD_REQUEST, Device, DevicesActionType, RequestPayload, SET_DEVICES, UPDATE_DEVICE} from "./types";


export function updateDevice(device: Device): DevicesActionType {
  return {
    type: UPDATE_DEVICE,
    device: device
  }
}

export function addRequest(request: RequestPayload) {
  return {
    type: ADD_REQUEST,
    request: request
  }
}

export function setDevices(devices: Device[]): DevicesActionType {
  return {
    type: SET_DEVICES,
    devices: devices
  }
}