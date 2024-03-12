import { Box } from '@mui/material';

export type Variant = 'danger' | 'warning' | 'success';

export default function Chip({ variant, children } : { variant?: Variant, children: string | JSX.Element }) {
  const COLORS = {
    success: '#008A40',
    warning: '#1F0E8F',
    danger: '#ff0000',
  };

  return (
    <Box sx={{
      px: '1rem',
      py: '.5rem',
      bgcolor: `${COLORS[variant]}25`,
      color: COLORS[variant],
      borderRadius: '.3rem',
      width: 'fit-content',
      fontWeight: (theme) => theme.typography.fontWeightMedium,
    }}
    >
      {children}
    </Box>
  );
}

Chip.defaultProps = {
  variant: 'success',
};
