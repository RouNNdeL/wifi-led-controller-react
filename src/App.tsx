import * as React from "react";
import {useEffect, useMemo} from "react";
import injectSheet from 'react-jss';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {getPreferences, setTheme} from "./store/preferences/actions";
import {
  AppBar, Box,
  createMuiTheme,
  createStyles,
  IconButton,
  PaletteType,
  Paper,
  Theme,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import {Brightness4, Brightness7} from "@material-ui/icons";
import {connect} from "@giantmachines/redux-websocket/dist";
import DeviceGroup from "./components/DeviceGroup";

const style = {
  '@global': {
    body: {
      margin: 0
    },
    "html, body, #app": {
      height: "100%",
      overflow: "auto"
    }
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "100%",
      overflow: "auto"
    },
    appBar: {
      "& .MuiSvgIcon-root": {
        color: "white"
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    }
  }),
);

const App: React.FunctionComponent = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const preferences = useSelector((state: RootState) => state.preferences);
  const devices = useSelector((state: RootState) => state.devices);
  const dispatch = useDispatch();

  const themeType: PaletteType = preferences.theme ?? (prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: themeType,
        },
      }),
    [themeType],
  );

  function changeTheme() {
    dispatch(setTheme(themeType === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    dispatch(getPreferences());
    dispatch(connect("ws://192.168.1.181:81"));
  }, []);

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.root} elevation={0}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon/>
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Bed Lights
            </Typography>
            <Tooltip title={themeType === "light" ? "Dark theme" : "Light theme"}>
              <IconButton onClick={changeTheme}>
                {themeType === "light" ? <Brightness4/> : <Brightness7/>}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box m={1}>
        {
          devices.clientId !== null ? <DeviceGroup spacing={2} xs={12} sm={6} md={4} lg={3} xl={3}/> : null
        }
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default injectSheet(style)(App);