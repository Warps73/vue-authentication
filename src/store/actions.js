/* eslint-disable */
import {
  AUTH_REQUEST,
  AUTH_SIGNUP,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_PERSIST
} from "@/store/actions/auth"
// import { settings } from "@/settings"
import router from "../router";
import axios from 'axios'
const API_SERVER = process.env.VUE_APP_API_HOST || "https://v-cosmic-auth.netlify.com/"

export default {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      // Login request
      commit(AUTH_REQUEST);
      axios.post(API_SERVER+'.netlify/functions/AuthenticateUser', user).then(res => {
        if (res.status == 200) {
          commit(AUTH_SUCCESS, res.data);
          localStorage.setItem("user-token", res.data.metadata.token);
          router.push('profile');
        }
        resolve(res);
      }).catch(err => {
        commit(AUTH_ERROR, err);
        localStorage.removeItem("user-token");
        reject(err);
      })
    });
  },
  [AUTH_SIGNUP]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios.post(API_SERVER+'.netlify/functions/CreateNewUser', user).then(res => {
        console.log(res)
        if (res.status == 200) {
          localStorage.setItem("user-token", res.data.metadata.token);
          commit(AUTH_SUCCESS, res.data)
          router.push('/profile')
          resolve(res)
        } else {
          commit(AUTH_ERROR)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise(resolve => {
      // Sign out user
      localStorage.removeItem('user-token')
      commit(AUTH_LOGOUT)
      router.push('login')
      resolve()
    })
  },
  [AUTH_PERSIST]: ({ commit }, token) => {
    return new Promise((resolve, reject) => {
      axios.post(API_SERVER+'.netlify/functions/LoadProfile', token).then(res => {
        console.log(res.data)
        commit(AUTH_SUCCESS, res.data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}
