// ----------------------------------------------------------------------

export default function AppBar(theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.grey[40]}`,
          color: 'unset',
        },
      },
    },
  };
}
