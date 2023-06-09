import { Box, BoxProps } from '@mui/material';

export default function BorderedBox({ children, sx }: BoxProps) {
  return (
    <Box sx={{
      border: (theme) => `1px solid ${theme.palette.divider}`,
      borderRadius: '0.5rem',
      px: '.5rem',
      ...sx,
    }}
    >
      {children}
    </Box>
  );
}
