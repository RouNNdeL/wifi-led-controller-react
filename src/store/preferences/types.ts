export const GET_PREFERENCES = "GET_PREFERENCES";
export const SET_THEME = "SET_THEME";

export const KEY_THEME = "THEME";

export type ThemeType = null | "light" | "dark";

export interface PreferencesState {
  theme: ThemeType
}

export interface GetPreferencesAction {
  type: typeof GET_PREFERENCES,
  preferences: PreferencesState
}

export interface SetThemeAction {
  type: typeof SET_THEME,
  theme: ThemeType
}

export type PreferencesActionType = GetPreferencesAction | SetThemeAction