import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { useDispatch, connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PasswordHeader from './PasswordHeader';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Password(props) {
  const dispatch = useDispatch();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      passwordConfirm: '',
      oldPassword: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, handleSubmit } = methods;
  const form = watch();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await axios({
        url: `/password`,
        method: 'POST',
        data: {
          password: data.password,
          oldPassword: data.oldPassword,
          confirmPassword: data.passwordConfirm,
        },
      });
      reset({
        password: '',
        passwordConfirm: '',
        oldPassword: '',
      });
      setSaving(false);
      dispatch(props.showMessage({ message: 'Saved' }));
    } catch (err) {
      setSaving(false);
      console.log(err);
      reset({
        password: '',
        passwordConfirm: '',
        oldPassword: '',
      });
    }
  };
  console.log(formState);

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<PasswordHeader onSubmit={handleSubmit(onSubmit)} saving={saving} />}
        content={
          <form>
            <div className="p-16 sm:p-24 max-w-2xl">
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Old Password"
                    className="mt-8 mb-16"
                    type="password"
                    helperText={formState.errors.password?.message}
                    error={!!formState.errors.password}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    className="mt-8 mb-16"
                    type="password"
                    helperText={formState.errors.password?.message}
                    error={!!formState.errors.password}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="passwordConfirm"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    label="Password (Confirm)"
                    type="password"
                    helperText={formState.errors.passwordConfirm?.message}
                    error={!!formState.errors.passwordConfirm}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
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

export default connect(null, mapDispatchToProps)(Password);
