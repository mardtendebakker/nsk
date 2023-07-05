// ----------------------------------------------------------------------

export default function Avatar(theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          height: '2.2rem',
          width: '2.2rem',
          backgroundColor: 'white',
          color: theme.palette.primary.dark,
          border: `1px solid ${theme.palette.primary.dark}`,
        },
      },
    },
  };
}
