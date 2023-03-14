import { Button, SxProps } from '@mui/material';
import EditLocation from '@mui/icons-material/EditLocation';
import useTranslation from '../../hooks/useTranslation';

export default function ChangeLocationButton({
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
      <EditLocation sx={{ mr: '.1rem' }} />
      {trans('changeLocation')}
    </Button>
  );
}

ChangeLocationButton.defaultProps = { sx: undefined, disabled: false };
