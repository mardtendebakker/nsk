import {
  Theme, useTheme, Typography, TableCell,
} from '@mui/material';
import useTranslation from '../../hooks/useTranslation';

const getStatus = (status: number, theme: Theme) => ({
  0: {
    name: 'toDo',
    color: theme.palette.primary.main,
    bgColor: theme.palette.grey[30],
  },
  1: {
    name: 'hold',
    color: theme.palette.warning.main,
    bgColor: theme.palette.warning.light,
  },
  2: {
    name: 'busy',
    color: theme.palette.warning.main,
    bgColor: theme.palette.warning.light,
  },
  3: {
    name: 'done',
    color: theme.palette.success.main,
    bgColor: theme.palette.success.light,
  },
  4: {
    name: 'cancel',
    color: undefined,
    bgColor: undefined,
  },
}[status]);

export default function TaskStatusTableCell({ status }:{ status: number }) {
  const { trans } = useTranslation();
  const theme = useTheme();
  const element = getStatus(status, theme);

  return (
    <TableCell sx={{
      bgcolor: element.bgColor,
      padding: '0 16px',
      minWidth: '14rem',
    }}
    >
      <Typography variant="inherit" sx={{ color: element.color }}>
        {trans(element.name)}
      </Typography>
    </TableCell>
  );
}
