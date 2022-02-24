import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response &&
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const jwt = this.getAccessToken();

    if (!jwt) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(jwt)) {
      this.setSession(jwt);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'jwt expired');
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/local/register', data)
        .then((response) => {
          console.log(response);
          if (response.data.user) {
            this.setSession(response.data.jwt);
            resolve(response.data.user);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/auth/local', {
          identifier: email,
          password,
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.jwt);
            resolve(response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      console.log('signInWithToken');
      axios
        .get('/users/me', {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        })
        .then((response) => {
          this.setSession(this.getAccessToken());
          resolve(response.data);
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post('/api/auth/user/update', {
      user,
    });
  };

  setSession = (jwt) => {
    if (jwt) {
      localStorage.setItem('jwt_access_token', jwt);
      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
  };

  isAuthTokenValid = (jwt) => {
    if (!jwt) {
      return false;
    }
    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };
}

const instance = new JwtService();

export default instance;
