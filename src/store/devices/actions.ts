import {Device, DevicesActionType, INCREMENT_PACKET_ID, SET_DEVICES, UPDATE_DEVICE} from "./types";


export function updateDevice(device: Device): DevicesActionType {
  return {
    type: UPDATE_DEVICE,
    device: device
  }
}

export function incrementPacketId() {
  return {type: INCREMENT_PACKET_ID};
}

export function setDevices(devices: Device[]): DevicesActionType {
  return {
    type: SET_DEVICES,
    devices: devices
  }
}