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
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        head: {
          color: theme.palette.text.secondary,
          padding: '0.45rem 1rem',
        },
      },
    },
  };
}
