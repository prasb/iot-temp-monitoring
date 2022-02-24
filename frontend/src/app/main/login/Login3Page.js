import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';

import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';

import clsx from 'clsx';
import * as yup from 'yup';
import { connect } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useHistory } from 'react-router';
import logo from '../../fuse-layouts/assets/logo/jpg/logo.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {},
  leftSection: {},
  rightSection: {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
      theme.palette.primary.dark,
      0.5
    )} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
});

const defaultValues = {
  email: '',
  password: '',
};

function LoginPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const token = window.localStorage.getItem('jwt_access_token');
    // if (token) {
    //   history.push('/');
    // }
  }, []);

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(values) {
    props.submitLogin({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
      >
        <Card
          className={clsx(
            classes.leftSection,
            'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
          )}
          square
        >
          <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="flex items-center mb-48">
                <img
                  className="logo-icon w-50"
                  src={logo}
                  alt="logo"
                  style={{
                    width: '10rem',
                  }}
                />
              </div>
            </motion.div>

            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-16"
                    label="Email"
                    autoFocus
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
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
                    className="mb-16"
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Button
                variant="contained"
                color="primary"
                className="w-full mx-auto mt-16"
                aria-label="LOG IN"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
              >
                Login
              </Button>
            </form>
          </CardContent>

          <div className="flex flex-col items-center justify-center pb-32">
            <span className="font-normal">Don't have an account?</span>
            <Link className="font-normal" to="/register">
              Create an account
            </Link>
          </div>
        </Card>

        <div
          className={clsx(
            classes.rightSection,
            'hidden md:flex flex-1 items-center justify-center p-64'
          )}
        >
          <div className="max-w-320">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                color="inherit"
                className="text-32 sm:text-44 font-semibold leading-tight"
              >
                Welcome
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography variant="subtitle1" color="inherit" className="mt-32 font-medium">
                Powerful data monitoring.
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      submitLogin,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(LoginPage);
