// ----------------------------------------------------------------------

export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[70],
        },
        arrow: {
          color: theme.palette.grey[70],
        },
      },
    },
  };
}
