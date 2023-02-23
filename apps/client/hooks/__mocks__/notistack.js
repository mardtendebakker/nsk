const notistack = jest.createMockFromModule('notistack');

notistack.useSnackbar = () => ({
  enqueueSnackbar: () => {},
});

module.exports = notistack;
