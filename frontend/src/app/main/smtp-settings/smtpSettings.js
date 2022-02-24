import FusePageCarded from '@fuse/core/FusePageCarded';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { Controller, useForm, FormProvider } from 'react-hook-form';
// import { FormGroup, FormControlLabel,  } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import { resetProduct, newProduct, getProduct } from '../store/productSlice';
import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import axios from 'axios';
import SmtpSettingsHeader from './smtpSettingsHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
/**
 * Form Validation Schema
 */
const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
  })
  .required();

function SmtpSettings(props) {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      host: '',
      username: '',
      password: '',
      port: 587,
      autoTLS: false,
      authentication: false,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, handleSubmit } = methods;
  const form = watch();

  const [state, setState] = useState({
    loading: true,
    error: false,
    data: {},
  });

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      const { data: reponse } = await axios({
        url: '/mail-settings',
        method: 'GET',
      });
      if (Array.isArray(reponse) && reponse.length > 0) {
        const data = reponse[0];
        reset({
          email: data.email,
          host: data.host,
          username: data.username,
          password: data.password,
          port: data.port,
          autoTLS: data.autoTLS,
          authentication: data.authentication,
        });
        setState({ loading: false, data, new: false, error: false });
      } else {
        setState({ loading: false, data: {}, new: true, error: false });
      }
    } catch (error) {
      setState({ loading: false, data: {}, new: true, error: true });
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (state.new) {
        await axios({
          url: '/mail-settings',
          method: 'POST',
          data: {
            email: data.email,
            host: data.host,
            username: data.username,
            password: data.password,
            port: parseInt(data.port || '587', 10),
            autoTLS: data.autoTLS,
            authentication: data.authentication,
          },
        });
      } else {
        await axios({
          url: `/mail-settings/${state.data._id}`,
          method: 'PUT',
          data: {
            email: data.email,
            host: data.host,
            username: data.username,
            password: data.password,
            port: parseInt(data.port || '587', 10),
            autoTLS: data.autoTLS,
            authentication: data.authentication,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (state.loading) {
    return <FuseLoading />;
  }
  if (state.error) {
    return <>Error</>;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<SmtpSettingsHeader onSubmit={handleSubmit(onSubmit)} />}
        content={
          <div className="p-16 sm:p-24 max-w-2xl">
            <div>
              <BasicInfoTab MainName="Send Email" purpose="email" focus type="email" />
            </div>

            <div>
              <BasicInfoTab MainName="Host" purpose="host" focus={false} />
            </div>

            <div>
              <BasicInfoTab MainName="Username" purpose="username" focus={false} />
            </div>

            <div>
              <BasicInfoTab MainName="Password" purpose="password" focus={false} type="password" />
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
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default SmtpSettings;
