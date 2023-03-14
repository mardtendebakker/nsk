import { Button, SxProps } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import useTranslation from '../../hooks/useTranslation';

export default function ChangeAvailabilityButton({
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
    <Button sx={sx} variant="outlined" color="primary" onClick={onClick} disabled={disabled}>
      <Edit sx={{ mr: '.1rem' }} />
      {trans('changeAvailability')}
    </Button>
  );
}

ChangeAvailabilityButton.defaultProps = { sx: undefined, disabled: false };
