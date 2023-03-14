import { Box } from '@mui/material';
import useTranslation from '../../hooks/useTranslation';

const WORDING = {
  0: 'toDo',
  1: 'inProgress',
  2: 'done',
};

const colors = (theme) => ({
  0: {
    color: theme.palette.primary.main,
    bgColor: theme.palette.grey[30],
  },
  1: {
    color: theme.palette.warning.main,
    bgColor: theme.palette.warning.light,
  },
  2: {
    color: theme.palette.success.main,
    bgColor: theme.palette.success.light,
  },
});

export default function Status({ status }: { status: '0' | '1' | '2' }) {
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
      {`${trans(WORDING[status])} (${status}/2)`}
    </Box>
  );
}
