import * as React from "react";
import {useState} from "react";
import {Grid} from "@material-ui/core";
import {GridSpacing} from "@material-ui/core/Grid/Grid";
import DeviceCard, {ChangeHandler, SynchronizeChangeHandler} from "./DeviceCard";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {updateDevice} from "../store/devices/actions";
import {send} from "@giantmachines/redux-websocket/dist";
import {Device} from "../store/devices/types";

interface DeviceGroupProps {
  spacing?: GridSpacing;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

function serializeDevice(device: Device): Uint8Array {
  const colorInt = Number("0x" + device.color.substring(1));
  return new Uint8Array([
    device.index, device.brightness * 2.55, device.state ? 1 : 0,
    colorInt >> 16, colorInt >> 8, colorInt
  ]);
}

const DeviceGroup: React.FunctionComponent<DeviceGroupProps> = (props) => {
    const [synchronized, setSynchronized] = useState<number[]>([]);
    const devices = useSelector((state: RootState) => state.devices.devices);
    const dispatch = useDispatch();

    const handleSynchronizeChange: SynchronizeChangeHandler = (index, value) => {
      if (value) {
        setSynchronized(synchronized.concat([index]));
      } else {
        setSynchronized(synchronized.filter(v => v !== index));
      }
    };

    const onUpdate: ChangeHandler = (newState) => {
      if (synchronized.length > 0 && synchronized.indexOf(newState.index) >= 0) {
        // TODO: Add support for synchronization
      } else {
        dispatch(updateDevice(newState));
      }

      saveDevice(newState);
    };

    const saveDevice = (device: Device) => {
      const data = serializeDevice(device);
      const payload = new Uint8Array(10);
      payload[0] = 0xB0; // Begin transaction
      payload[1] = 0x01; // Simple change command
      payload[2] = 0x06; // Payload length
      payload.set(data, 3); // Payload
      payload[9] = 0xB1; // Commit transaction

      dispatch(send(payload.buffer));
    };

    return (
      <div>
        <Grid container spacing={props.spacing}>
          {devices.map((device) => {
            return (
              // @ts-ignore
              <Grid item xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl} key={device.index}>
                <DeviceCard device={device}
                            onChange={onUpdate}
                            onSynchronizeChange={handleSynchronizeChange}
                />
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
;

export default DeviceGroup;