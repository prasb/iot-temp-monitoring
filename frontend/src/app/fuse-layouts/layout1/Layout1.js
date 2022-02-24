/* eslint-disable import/no-cycle */
import { memo, useContext, createContext, useEffect, useState } from 'react';
import FuseDialog from '@fuse/core/FuseDialog';
import FuseMessage from '@fuse/core/FuseMessage';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from 'app/AppContext';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import axios from 'axios';
import FuseLoading from '@fuse/core/FuseLoading';
import { useLocation } from 'react-router';
import LeftSideLayout1 from './components/LeftSideLayout1';
import NavbarWrapperLayout1 from './components/NavbarWrapperLayout1';
import RightSideLayout1 from './components/RightSideLayout1';
import ToolbarLayout1 from './components/ToolbarLayout1';

export const DeviceContext = createContext({});

const useStyles = makeStyles((theme) => ({
  root: {
    '&.boxed': {
      clipPath: 'inset(0)',
      maxWidth: (props) => `${props.config.containerWidth}px`,
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    '&.container': {
      '& .container': {
        maxWidth: (props) => `${props.config.containerWidth}px`,
        width: '100%',
        margin: '0 auto',
      },
    },
  },
}));

function Layout1(props) {
  const location = useLocation();
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const user = useSelector((s) => s.auth.user || {});
  const appContext = useContext(AppContext);
  const { routes } = appContext;
  const classes = useStyles({ ...props, config });

  const [state, setState] = useState({
    loading:
      location.pathname !== '/login' &&
      location.pathname !== '/register' &&
      (user.data.email || user.data.username),
    error: false,
    devices: [],
    deviceId: null,
  });

  useEffect(() => {
    if (state.loading) {
      fetchValues();
    }
  }, []);

  const fetchValues = async () => {
    try {
      const { data: devicesReponse } = await axios({
        url: '/devices',
        method: 'GET',
      });

      if (Array.isArray(devicesReponse) && devicesReponse.length > 0) {
        setState({
          loading: false,
          devices: devicesReponse,
          deviceId: devicesReponse[0]._id,
          uid: devicesReponse[0].uid,
          error: false,
        });
      } else {
        setState({ ...state, loading: false, error: false });
      }
    } catch (error) {
      setState({ ...state, loading: false, error: true });
      console.log(error);
    }
  };

  if (state.loading) {
    return <FuseLoading />;
  }
  if (state.error) {
    return <>Error</>;
  }

  return (
    <DeviceContext.Provider
      value={{
        state,
        setState,
        fetchValues,
      }}
    >
      <div id="fuse-layout" className={clsx(classes.root, config.mode, 'w-full flex')}>
        {config.leftSidePanel.display && <LeftSideLayout1 />}

        <div className="flex flex-auto min-w-0">
          {config.navbar.display && config.navbar.position === 'left' && <NavbarWrapperLayout1 />}

          <main
            id="fuse-main"
            className="flex flex-col flex-auto min-h-screen min-w-0 relative z-10"
          >
            {config.toolbar.display && (
              <ToolbarLayout1 className={config.toolbar.style === 'fixed' && 'sticky top-0'} />
            )}

            {/*    Just remove this commented line to get the "Change Layout setting Button" or "SettingPanel"
          <div className="sticky top-0 z-99">       
            <SettingsPanel />
          </div> 
          */}

            <div className="flex flex-col flex-auto min-h-0 relative z-10">
              <FuseDialog />

              <FuseSuspense>{renderRoutes(routes)}</FuseSuspense>

              {props.children}
            </div>
            {/*       Remove this commented line to add Footer to the Layout 1 
          {config.footer.display && (
            <FooterLayout1 className={config.footer.style === 'fixed' && 'sticky bottom-0'} />
          )} */}
          </main>

          {config.navbar.display && config.navbar.position === 'right' && <NavbarWrapperLayout1 />}
        </div>

        {config.rightSidePanel.display && <RightSideLayout1 />}
        <FuseMessage />
      </div>
    </DeviceContext.Provider>
  );
}

export default memo(Layout1);
