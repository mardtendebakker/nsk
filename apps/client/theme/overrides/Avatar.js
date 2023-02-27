// ----------------------------------------------------------------------

export default function Avatar(theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: theme.palette.primary.dark,
          border: `1px solid ${theme.palette.primary.dark}`,
        },
      },
    },
  };
}
