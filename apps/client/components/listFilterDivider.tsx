import { Box } from '@mui/material';

export default function ListFilterDivider({ horizontal }: { horizontal: boolean }) {
  return (
    <Box
      sx={(theme) => ({
        width: horizontal ? '100%' : '1px',
        height: horizontal ? '1px' : '2.5rem',
        background: theme.palette.divider,
      })}
    />
  );
}
