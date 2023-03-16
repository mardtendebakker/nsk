import { Box, SxProps } from '@mui/material';

export default function BorderedBox(
  { children, sx }: { children: JSX.Element | JSX.Element[], sx?: SxProps },
) {
  return (
    <Box sx={(theme) => {
      let overrideStyle: object = sx || {};

      if (typeof sx === 'function') {
        overrideStyle = sx(theme);
      }

      return {
        border: `1px solid ${theme.palette.grey[30]}`,
        borderRadius: '0.5rem',
        px: '.5rem',
        ...overrideStyle,
      };
    }}
    >
      {children}
    </Box>
  );
}

BorderedBox.defaultProps = { sx: undefined };
