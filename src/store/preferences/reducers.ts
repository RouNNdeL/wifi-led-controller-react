import {GET_PREFERENCES, PreferencesActionType, PreferencesState, SET_THEME} from "./types";

const initialState: PreferencesState = {
  theme: null
};

export function preferencesReducer(state = initialState, action: PreferencesActionType): PreferencesState {
  switch (action.type) {
    case GET_PREFERENCES:
      return action.preferences;
    case SET_THEME:
      return {
        ...state,
        theme: action.theme
      };
    default:
      return state;
  }
}