import {combineReducers} from "redux";
import {devicesReducer} from "./devices/reducers";
import {preferencesReducer} from "./preferences/reducers";

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  devices: devicesReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>