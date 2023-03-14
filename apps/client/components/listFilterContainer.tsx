import { Box } from '@mui/material';

export default function ListFilterContainer(
  { children }: { children: JSX.Element | JSX.Element[] },
) {
  return (
    <Box sx={(theme) => ({
      border: `1px solid ${theme.palette.grey[30]}`,
      borderRadius: '0.5rem',
      px: '.5rem',
    })}
    >
      {children}
    </Box>
  );
}
