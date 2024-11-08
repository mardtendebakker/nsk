import { Box, Theme } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

const TO_DO = 'toDo';
const IN_PROGRESS = 'inProgress';
const DONE = 'done';

function getStatus(value: number) {
  if (value <= 0) {
    return TO_DO;
  }

  if (value < 1) {
    return IN_PROGRESS;
  }

  return DONE;
}

const colors = (theme: Theme) => ({
  [TO_DO]: {
    color: theme.palette.primary.main,
    bgColor: theme.palette.grey[30],
  },
  [IN_PROGRESS]: {
    color: theme.palette.warning.main,
    bgColor: theme.palette.warning.light,
  },
  [DONE]: {
    color: theme.palette.success.main,
    bgColor: theme.palette.success.light,
  },
});

export default function TasksProgress({ done = 0, tasks = 0 }: { done?: number, tasks?: number }) {
  const { trans } = useTranslation();
  const status = getStatus(done / tasks);

  return (
    <Box sx={(theme) => ({
      p: '.2rem .5rem',
      borderRadius: '.3rem',
      backgroundColor: colors(theme)[status].bgColor,
      color: colors(theme)[status].color,
      width: 'fit-content',
    })}
    >
      {`${trans(status)} (${done}/${tasks})`}
    </Box>
  );
}
