import { useEffect, useContext, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Typography from '@material-ui/core/Typography';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Switch, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector, connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import ProductHeader from './ConfigurationHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import BasicInfoTab2 from './tabs/BasicInfoTab2';
import { DeviceContext } from '../../fuse-layouts/layout1/Layout1';

function Configuration(props) {
  const dispatch = useDispatch();
  const product = useSelector(({ eCommerceApp }) => eCommerceApp.product);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      maxTemp: '',
      minTemp: '',
      maxHumidity: '',
      minHumidity: '',
      alertForTemp: false,
      alertForHumidity: false,
      notifyEmail: '',
      alertInterval: '',
      fromAddress: '',

      email: '',
      host: '',
      username: '',
      password: '',
      port: 587,
      autoTLS: false,
      authentication: false,
    },
  });
  const { reset, watch, control, onChange, formState, handleSubmit, errors } = methods;
  const form = watch();
  const { state, fetchValues } = useContext(DeviceContext);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.deviceId) {
      const found = state.devices.find((device) => device.id === state.deviceId);
      if (found) {
        reset({
          maxTemp: found.configuration.maxTemp || '',
          minTemp: found.configuration.minTemp || '',
          maxHumidity: found.configuration.maxHumidity || '',
          minHumidity: found.configuration.minHumidity || '',
          alertForTemp: found.configuration.alertForTemp || false,
          alertForHumidity: found.configuration.alertForHumidity || false,
          notifyEmail: found.configuration.notifyEmail || '',
          fromAddress: found.configuration.fromAddress || '',
          alertInterval: found.configuration.alertInterval || '',

          email: found.mailSettings.email || '',
          host: found.mailSettings.host || '',
          username: found.mailSettings.username || '',
          password: found.mailSettings.password || '',
          port: found.mailSettings.port || '587',
          autoTLS: found.mailSettings.autoTLS || false,
          authentication: found.mailSettings.authentication || '',
        });
      }
    }
  }, [state]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await axios({
        url: `/devices/${state.deviceId}`,
        method: 'PUT',
        data: {
          configuration: {
            maxTemp: parseFloat(data.maxTemp),
            minTemp: parseFloat(data.minTemp),
            maxHumidity: parseFloat(data.maxHumidity),
            minHumidity: parseFloat(data.minHumidity),
            alertForTemp: data.alertForTemp,
            alertForHumidity: data.alertForHumidity,
            notifyEmail: data.notifyEmail,
            fromAddress: data.fromAddress,
            alertInterval: parseFloat(data.alertInterval),
          },
          mailSettings: {
            email: data.email,
            host: data.host,
            username: data.username,
            password: data.password,
            port: parseInt(data.port || '587', 10),
            autoTLS: data.autoTLS,
            authentication: data.authentication,
          },
        },
      });
      setSaving(false);
      dispatch(props.showMessage({ message: 'Saved' }));
      await fetchValues();
    } catch (err) {
      setSaving(false);
      console.log(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<ProductHeader onSubmit={handleSubmit(onSubmit)} saving={saving} />}
        content={
          <form>
            <div className="p-16 sm:p-24 max-w-2xl">
              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Temperature
              </Typography>

              <div>
                <BasicInfoTab type="temperature" />
              </div>
              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Humidity
              </Typography>

              <div>
                <BasicInfoTab type="humidity" />
              </div>
              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Alert
              </Typography>
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Controller
                        control={control}
                        name="alertForTemp"
                        render={({ field }) => {
                          return (
                            <Switch
                              {...field}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          );
                        }}
                      />
                    }
                    label="Alert For Temperature"
                  />
                  <FormControlLabel
                    control={
                      <Controller
                        control={control}
                        name="alertForHumidity"
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Alert For Humidity"
                  />
                </FormGroup>
                <div>
                  <BasicInfoTab2
                    MainName="Alert Interval"
                    focus={false}
                    purpose="alertInterval"
                    required={false}
                  />
                </div>
              </div>
              <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                Notification Email
              </Typography>

              <Controller
                name="fromAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    label="From Address"
                    variant="outlined"
                    fullWidth
                    helperText={formState.errors.fromAddress?.message}
                    error={!!formState.errors.fromAddress}
                  />
                )}
              />
              <Controller
                name="notifyEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    label="Notification Email"
                    variant="outlined"
                    fullWidth
                    helperText={formState.errors.notifyEmail?.message}
                    error={!!formState.errors.notifyEmail}
                  />
                )}
              />
              <div>
                <BasicInfoTab2 MainName="Send Email" purpose="email" focus type="email" />
              </div>

              <div>
                <BasicInfoTab2 MainName="Host" purpose="host" focus={false} />
              </div>

              <div>
                <BasicInfoTab2 MainName="Username" purpose="username" focus={false} />
              </div>

              <div>
                <BasicInfoTab2
                  MainName="Password"
                  purpose="password"
                  focus={false}
                  type="password"
                />
              </div>

              <Controller
                name="port"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    required
                    label="Port"
                    variant="outlined"
                    fullWidth
                    type="number"
                  />
                )}
              />

              <div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Controller
                        control={control}
                        name="autoTLS"
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Auto TLS"
                  />
                  <FormControlLabel
                    control={
                      <Controller
                        control={control}
                        name="authentication"
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Authentication"
                  />
                </FormGroup>
              </div>
            </div>
          </form>
        }
        innerScroll
      />
    </FormProvider>
  );
}

// export default withReducer('eCommerceApp', reducer)(Product);

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showMessage,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Configuration);
