import {
  Device,
  REQUEST_PAYLOAD_SAVE_DEVICE,
  RequestPayload,
  RESPONSE_PAYLOAD_ERROR,
  RESPONSE_PAYLOAD_SAVE_DEVICE,
  ResponsePayload,
} from "../store/devices/types";

export class BinarySerializer {
  public static readonly BEGIN_TRANSACTION = 0xB0;
  public static readonly COMMIT_TRANSACTION = 0xB1;

  public static readonly CMD_SAVE_DEVICE = 0x01;
  public static readonly CMD_GET_DEVICE = 0x02;
  public static readonly CMD_GET_ALL_DEVICES = 0x03;

  public static readonly CMD_SAVE_DEVICE_RESPONSE = 0xA1;
  public static readonly CMD_GET_DEVICE_RESPONSE = 0xA2;
  public static readonly CMD_GET_ALL_DEVICES_RESPONSE = 0xA3;

  public static getBinaryPayload(payload: RequestPayload): Uint8Array {
    switch (payload.type) {
      case REQUEST_PAYLOAD_SAVE_DEVICE:
        return this.getSaveDevicePayload(payload.device);
      default:
        throw Error("Invalid payload type");
    }
  }

  public static getPayloadFromBinary(buffer: ArrayBuffer): ResponsePayload {
    const data = new Uint8Array(buffer);
    if (data[0] !== this.BEGIN_TRANSACTION) {
      return {
        type: RESPONSE_PAYLOAD_ERROR,
        identifier: data[0]
      }
    }

    switch (data[1]) {
      case this.CMD_SAVE_DEVICE_RESPONSE:
        return {
          type: RESPONSE_PAYLOAD_SAVE_DEVICE
        };
      default:
        return {
          type: RESPONSE_PAYLOAD_ERROR,
          identifier: 0xF2
        }
    }
  }

  private static getSaveDevicePayload(device: Device): Uint8Array {
    const data = this.serializeDevice(device);
    const payload = new Uint8Array(10);
    payload[0] = this.BEGIN_TRANSACTION;
    payload[1] = this.CMD_SAVE_DEVICE;
    payload[2] = 0x06; // Payload length
    payload.set(data, 3);
    payload[9] = this.COMMIT_TRANSACTION;

    return payload;
  }

  private static serializeDevice(device: Device): Uint8Array {
    const colorInt = Number("0x" + device.color.substring(1));
    return new Uint8Array([
      device.index, device.brightness * 2.55, device.state ? 1 : 0,
      colorInt >> 16, colorInt >> 8, colorInt
    ]);
  }
}