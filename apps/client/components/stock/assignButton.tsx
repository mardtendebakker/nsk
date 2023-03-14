import { Button, SxProps } from '@mui/material';
import PersonAddAlt1 from '@mui/icons-material/PersonAddAlt1';
import useTranslation from '../../hooks/useTranslation';

export default function AssignButton({
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
      <PersonAddAlt1 sx={{ mr: '.3rem' }} />
      {trans('assign')}
    </Button>
  );
}

AssignButton.defaultProps = { sx: undefined, disabled: false };
