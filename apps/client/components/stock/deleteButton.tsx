import { Button, SxProps } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import useTranslation from '../../hooks/useTranslation';

export default function DeleteButton({
  onClick,
  sx,
  disabled,
}: {
  onClick: ()=> void,
  sx?: SxProps,
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <Button sx={sx} variant="outlined" color="error" onClick={onClick} disabled={disabled}>
      <Delete sx={{ mr: '.1rem' }} />
      {trans('delete')}
    </Button>
  );
}

DeleteButton.defaultProps = { sx: undefined, disabled: false };
