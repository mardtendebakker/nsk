const axios = jest.createMockFromModule('axios');

axios.create = () => ({
  get: () => {},
  post: () => {},
  put: () => {},
  delete: () => {},
  patch: () => {},
  interceptors: {
    request: {
      use: () => {},
    },
    response: {
      use: () => {},
    },
  },
});

axios.CancelToken = {
  source: () => ({
    cancel: () => {},
    token: 'token',
  }),
};

module.exports = axios;
