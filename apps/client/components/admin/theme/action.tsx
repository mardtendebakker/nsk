import { Box, Button } from '@mui/material';
import Check from '@mui/icons-material/Check';
import useTranslation from '../../../hooks/useTranslation';

export default function Action({
  disabled, onReset, onSave,
}:{ disabled: boolean, onReset: () => void, onSave: () => void }) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        size="small"
        disabled={disabled}
        variant="outlined"
        onClick={onReset}
      >
        {trans('reset')}
      </Button>
      <Box sx={{ m: '.1rem' }} />
      <Button
        size="small"
        disabled={disabled}
        variant="contained"
        onClick={onSave}
      >
        <Check />
        {trans('save')}
      </Button>
    </Box>
  );
}
