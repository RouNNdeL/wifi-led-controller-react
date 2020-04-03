import {
  Device,
  REQUEST_PAYLOAD_GET_ALL_DEVICES,
  REQUEST_PAYLOAD_SAVE_DEVICE,
  RequestPayload,
  RESPONSE_PAYLOAD_ERROR,
  RESPONSE_PAYLOAD_GET_ALL_DEVICES,
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

  public static getBinaryPayload(payload: RequestPayload, clientId: number | null): Uint8Array {
    if (clientId == null) {
      throw new Error("Client id not initialized when attempting to prepare payload");
    }

    switch (payload.type) {
      case REQUEST_PAYLOAD_SAVE_DEVICE:
        const data = this.serializeDevice(payload.device);
        return this.preparePacket(this.CMD_SAVE_DEVICE, data, clientId, payload.packetId);
      case REQUEST_PAYLOAD_GET_ALL_DEVICES:
        return this.preparePacket(this.CMD_GET_ALL_DEVICES, null, clientId, payload.packetId);
      default:
        throw Error("Invalid payload type");
    }
  }

  public static getPayloadFromBinary(buffer: ArrayBuffer, clientId: number | null): ResponsePayload | null {
    const data = new Uint8Array(buffer);
    if (data[0] !== this.BEGIN_TRANSACTION) {
      return {
        type: RESPONSE_PAYLOAD_ERROR,
        packetId: -1,
        identifier: data[0]
      }
    }

    if (data[1] != clientId) {
      return null;
    }

    switch (data[4]) {
      case this.CMD_SAVE_DEVICE_RESPONSE:
        return {
          type: RESPONSE_PAYLOAD_SAVE_DEVICE,
          packetId: data[2] << 8 & data[1]
        };
      case this.CMD_GET_ALL_DEVICES_RESPONSE:
        const devices: Device[] = [];
        for (let i = 0; i < data[6]; i++) {
          let offset = 7 + i * 5;
          devices.push({
            name: null,
            index: i,
            brightness: Math.ceil(data[offset++] * 100 / 255),
            state: data[offset++] != 0,
            color: "#" + (data[offset++] << 16 | data[offset++] << 8 | data[offset]).toString(16).padStart(6, "0")
          });
        }

        return {
          type: RESPONSE_PAYLOAD_GET_ALL_DEVICES,
          packetId: data[2] << 8 & data[1],
          devices
        };
      default:
        return {
          type: RESPONSE_PAYLOAD_ERROR,
          packetId: -1,
          identifier: 0xF2
        }
    }
  }

  private static preparePacket(command: number, payload: Uint8Array | null, clientId: number, packetId: number) {
    const length = payload?.length ?? 0;
    const packet = new Uint8Array((length) + 7);

    packet[0] = this.BEGIN_TRANSACTION;
    packet.set([clientId, packetId >> 8, packetId], 1);
    packet[4] = command;
    packet[5] = length;
    // noinspection PointlessBooleanExpressionJS - not pointless, WebStorm?
    if(payload != null) {
      packet.set(payload, 6);
    }
    packet[(length) + 6] = this.COMMIT_TRANSACTION;

    return packet;
  }

  private static serializeDevice(device: Device): Uint8Array {
    const colorInt = Number("0x" + device.color.substring(1));
    return new Uint8Array([
      device.index, device.brightness * 2.55, device.state ? 1 : 0,
      colorInt >> 16, colorInt >> 8, colorInt
    ]);
  }
}