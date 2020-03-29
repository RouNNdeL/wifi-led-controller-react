import * as React from "react";
import {useEffect, useState} from "react";
import {ChromePicker} from 'react-color';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  Switch,
  Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ChromePickerStyles} from "react-color/lib/components/chrome/Chrome";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import {Device} from "../store/devices/types";

type SliderChangeHandler = (event: React.ChangeEvent<{}>, value: number | number[]) => void;
export type ChangeHandler = (newState: Device) => void;
export type SynchronizeChangeHandler = (index: number, value: boolean) => void;

interface DeviceCardProps {
  device: Device
  onChange?: ChangeHandler;
  minChangeInterval?: number;
  onSynchronizeChange: SynchronizeChangeHandler;
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  host: {
    marginLeft: "auto",
    fontSize: "12px"
  }
});

const DeviceCard: React.FunctionComponent<DeviceCardProps> = (props) => {
  const classes = useStyles();
  const [brightness, setBrightness] = useState<number>(props.device.brightness);
  const [color, setColor] = useState<string>(props.device.color);
  const [state, setState] = useState<boolean>(props.device.state);
  const [lastSave, setLastSave] = useState<number>(Date.now());
  const [saveTimeout, setSaveTimeout] = useState<number | undefined>();
  const {device, onChange, minChangeInterval = 50} = props;

  useEffect(() => {
    const lastSaveDuration = Date.now() - lastSave;

    if(lastSaveDuration > minChangeInterval) {
      onChange?.({...device, color, brightness, state});
      setLastSave(Date.now());
    } else {
      const mostRecentValue = {...device, color, brightness, state};

      window.clearTimeout(saveTimeout);
      setSaveTimeout(window.setTimeout(() => {
        onChange?.(mostRecentValue);
      }, lastSaveDuration));
    }
  }, [brightness, color, state]);

  const pickerStyles: ChromePickerStyles = {
    default: {
      picker: {
        width: "100%",
        boxShadow: "none"
      }
    }
  };

  const handleBrightnessChange: SliderChangeHandler = (e, v) => {
    if (typeof v !== "number") {
      throw new Error("Invalid value type");
    }
    setBrightness(v);
  };

  const changeBrightness = (delta: number) => {
    const b = Math.max(Math.min(brightness + delta, 100), 0);
    setBrightness(b);
  };

  const brightnessSliderId = `${device.index}-brightness-slider`;
  return (
    <Card className={classes.root}>
      <CardHeader
        title={device.name}
        action={
          <Box m={1}>
            <Switch
              checked={state}
              onChange={(_, v) => setState(v)}
            />
          </Box>
        }
      />
      <CardContent>
        <Typography id={brightnessSliderId} gutterBottom>
          Brightness
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <IconButton aria-label="decrease brightness" onClick={() => changeBrightness(-10)}>
              <BrightnessLowIcon color="action"/>
            </IconButton>
          </Grid>
          <Grid item xs>
            <Slider value={brightness} min={0} max={100} valueLabelDisplay="auto"
                    aria-labelledby={brightnessSliderId}
                    onChange={handleBrightnessChange}/>
          </Grid>
          <Grid item>
            <IconButton aria-label="increase brightness" onClick={() => changeBrightness(10)}>
              <BrightnessHighIcon color="action"/>
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={2}>
          <ChromePicker styles={pickerStyles} color={color} disableAlpha={true}
                        onChange={(v) => setColor(v.hex)}/>
        </Box>
        <FormControlLabel
          control={
            <Checkbox onChange={(_, v) =>
              props.onSynchronizeChange(device.index, v)}/>}
          label="Synchronize"
          labelPlacement="end"
        />
      </CardContent>
    </Card>
  );
};

export default DeviceCard;