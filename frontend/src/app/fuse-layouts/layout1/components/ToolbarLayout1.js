/* eslint-disable import/no-cycle */
import { memo, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarToggleButton from 'app/fuse-layouts/shared-components/NavbarToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { DeviceContext } from '../Layout1';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function ToolbarLayout1(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const navbar = useSelector(({ fuse }) => fuse.navbar);
  const toolbarTheme = useSelector(selectToolbarTheme);
  const { state, setState } = useContext(DeviceContext);

  const classes = useStyles(props);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx(classes.root, 'flex relative z-20 shadow-md', props.className)}
        color="default"
        style={{ backgroundColor: toolbarTheme.palette.background.paper }}
        position="static"
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64 flex items-center justify-between">
          <div className="flex px-16">
            {config.navbar.display && config.navbar.position === 'left' && (
              <>
                <Hidden mdDown>
                  {(config.navbar.style === 'style-3' ||
                    config.navbar.style === 'style-3-dense') && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}

                  {config.navbar.style === 'style-1' && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}
          </div>
          <h3
            style={{
              fontWeight: 600,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Softtek Temperature and Humidity Monitor
          </h3>

          <div className="header-right flex items-center ">
            <Select
              value={state.deviceId}
              onChange={(event) => {
                const found = state.devices.find((device) => device._id === event.target.value);
                setState({ ...state, deviceId: event.target.value, uid: found.uid });
              }}
            >
              {state.devices.map((e) => (
                <MenuItem value={e._id} key={e._id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
            <div className="flex items-center px-8 h-full overflow-x-auto">
              {/* <LanguageSwitcher /> */}

              {/* <AdjustFontSize /> */}

              {/* <FullScreenToggle /> */}

              {/* <FuseSearch /> */}

              {/* <QuickPanelToggleButton /> */}

              <UserMenu />
            </div>
            {config.navbar.display && config.navbar.position === 'right' && (
              <>
                <Hidden mdDown>
                  {!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
