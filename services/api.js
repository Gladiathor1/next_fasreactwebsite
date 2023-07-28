import axios from "axios";

const instance = axios.create({
  baseURL: process.env.baseURL,
  headers: { "content-type": "application/json; charset=utf-8" }
});

const api = {
  get: options => async (dispatch, getState) => {
    const state = getState();
    const [success, failure] = options.types;
    const customerBearer = options.customerBearer;
    instance.defaults.headers.common["Authorization"] = customerBearer
      ? customerBearer
      : process.env.mageToken;
    const promise = (resolve, reject) => {
      return instance
        .get(options.url)
        .then(res => {
          resolve(
            dispatch({
              type: success,
              payload: res.data
            })
          );
        })
        .catch(err => {
          reject(
            dispatch({
              type: failure,
              payload: err
            })
          );
        });
    };

    return new Promise(promise);
  },
  post: (options, params = null) => async (dispatch, getState) => {
    const state = getState();
    const [success, failure] = options.types;
    const customerBearer = options.customerBearer;
    instance.defaults.headers.common["Authorization"] = customerBearer
      ? customerBearer
      : process.env.mageToken;
    const promise = (resolve, reject) => {
      instance
        .post(options.url, params)
        .then(res => {
          resolve(
            dispatch({
              type: success,
              payload: res.data
            })
          );
        })
        .catch(err => {
          reject(
            dispatch({
              type: failure,
              payload: err
            })
          );
        });
    };

    return new Promise(promise);
  },
  put: (options, params = null) => async (dispatch, getState) => {
    const state = getState();
    const [success, failure] = options.types;
    const customerBearer = options.customerBearer;
    instance.defaults.headers.common["Authorization"] = customerBearer
      ? customerBearer
      : process.env.mageToken;
    const promise = (resolve, reject) => {
      instance
        .put(options.url, params)
        .then(res => {
          resolve(
            dispatch({
              type: success,
              payload: res.data
            })
          );
        })
        .catch(err => {
          reject(
            dispatch({
              type: failure,
              payload: err
            })
          );
        });
    };

    return new Promise(promise);
  },
  delete: options => async (dispatch, getState) => {
    const state = getState();
    const [success, failure] = options.types;
    const customerBearer = options.customerBearer;
    instance.defaults.headers.common["Authorization"] = customerBearer
      ? customerBearer
      : process.env.mageToken;
    const promise = (resolve, reject) => {
      instance
        .delete(options.url)
        .then(res => {
          resolve(
            dispatch({
              type: success,
              payload: res.data
            })
          );
        })
        .catch(err => {
          reject(
            dispatch({
              type: failure,
              payload: err
            })
          );
        });
    };

    return new Promise(promise);
  }
};

export { api };
