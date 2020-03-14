import {GET_PREFERENCES, KEY_THEME, PreferencesActionType, SET_THEME, ThemeType} from "./types";
import {Dispatch} from "redux";

type PreferencesDispatch = Dispatch<PreferencesActionType>;

export const getPreferences = () => {
  let theme = localStorage.getItem(KEY_THEME);
  if (theme !== "light" && theme !== "dark") {
    theme = null;
  }

  return {
    type: GET_PREFERENCES,
    preferences: {
      theme
    }
  }
};

export const setTheme = (theme: ThemeType) => {
  if (theme !== null) {
    localStorage.setItem(KEY_THEME, theme);
  } else {
    localStorage.removeItem(KEY_THEME);
  }

  return {
    type: SET_THEME,
    theme
  };
};