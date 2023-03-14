import { Button, SxProps } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useTranslation from '../../hooks/useTranslation';

export default function PrintButton({
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
      {trans('print')}
      <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
    </Button>
  );
}

PrintButton.defaultProps = { sx: undefined, disabled: false };
