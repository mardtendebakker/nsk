import { Box, Theme } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

const WORDING = { 0: 'inTransit' };

const colors = (theme: Theme) => ({
  0: {
    color: theme.palette.primary.main,
    bgColor: theme.palette.grey[30],
  },
});

export default function Status({ status }: { status: '0' }) {
  const { trans } = useTranslation();

  return (
    <Box sx={(theme) => ({
      p: '.2rem .5rem',
      borderRadius: '.3rem',
      backgroundColor: colors(theme)[status].bgColor,
      color: colors(theme)[status].color,
      width: 'fit-content',
    })}
    >
      {trans(WORDING[status])}
    </Box>
  );
}
