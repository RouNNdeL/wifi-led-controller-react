import * as React from "react";
import {useState} from "react";
import {Grid} from "@material-ui/core";
import {GridSpacing} from "@material-ui/core/Grid/Grid";
import DeviceCard, {ChangeHandler, SynchronizeChangeHandler} from "./DeviceCard";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {updateDevice} from "../store/devices/actions";
import {send} from "@giantmachines/redux-websocket/dist";
import {
  Device,
  REQUEST_PAYLOAD_GET_ALL_DEVICES,
  REQUEST_PAYLOAD_SAVE_DEVICE,
  RequestPayload
} from "../store/devices/types";
import {BinarySerializer} from "../utils/BinarySerializer";

interface DeviceGroupProps {
  spacing?: GridSpacing;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const DeviceGroup: React.FunctionComponent<DeviceGroupProps> = (props) => {
    const [synchronized, setSynchronized] = useState<number[]>([]);
    const deviceState = useSelector((state: RootState) => state.devices);
    const devices = deviceState.devices;
    const dispatch = useDispatch();

    if(devices.length === 0) {
      const request : RequestPayload = {
        type: REQUEST_PAYLOAD_GET_ALL_DEVICES,
        packetId: deviceState.packetId
      };
      const payload = BinarySerializer.getBinaryPayload(request, deviceState.clientId);

      dispatch(send(payload.buffer));
      //dispatch(addRequest(request));
    }

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
      if(deviceState.clientId == null) {
        return;
      }

      const payload = BinarySerializer.getBinaryPayload({
        type: REQUEST_PAYLOAD_SAVE_DEVICE,
        packetId: deviceState.packetId,
        device
      }, deviceState.clientId);

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