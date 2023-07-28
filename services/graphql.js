import axios from 'axios';

const graph = {
  post: (options, token) => async (dispatch) => {
    const [success, failure] = options.types;
    let header = {};
    if(token) {
      header = {
        "Authorization": `Bearer ${token}`
      }
    }
    const promise = (resolve, reject) => {
      axios.post(process.env.graphQL, { query: options.query }, { headers: header })
        .then(res => {
          resolve(dispatch({
            type: success,
            payload: res.data.data
          }))
        })
        .catch(err => {
          reject(dispatch({
            type: failure,
            payload: err
          }))
        })
    }

    return new Promise(promise);
  }
}

export { graph };
