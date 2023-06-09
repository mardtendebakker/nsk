import { Select, MenuItem, Theme } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';

export default function StatusPicker() {
  const { trans } = useTranslation();
  const WORDING = { 0: 'toDo' };

  const colors = (theme: Theme) => ({
    0: {
      color: theme.palette.primary.main,
      bgColor: theme.palette.grey[30],
    },
  });

  return (
    <Select
      defaultValue={0}
      size="small"
      sx={(theme) => ({
        p: '1.5rem',
        width: '15rem',
        borderRadius: 0,
        backgroundColor: colors(theme)[0].bgColor,
        color: colors(theme)[0].color,
      })}
    >
      <MenuItem value={0}>{trans(WORDING[0])}</MenuItem>
    </Select>
  );
}
