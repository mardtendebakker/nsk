export default function MenuItem() {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(183, 194, 209, 0.3)',
          },
        },
      },
    },
  };
}
