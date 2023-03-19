// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTable: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '0.5rem',
          borderCollapse: 'separate',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: theme.palette.text.secondary,
          padding: '0.45rem 1rem',
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },
  };
}
