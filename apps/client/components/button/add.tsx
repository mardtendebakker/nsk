import {
  SxProps, Tooltip, Typography, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useTranslation from '../../hooks/useTranslation';

export default function Add({
  onClick,
  disabled,
  title,
  sx,
}: {
  onClick: () => void,
  disabled?: boolean,
  title?: string,
  sx?: SxProps
}) {
  const { trans } = useTranslation();

  return (
    <Tooltip title={<Typography>{title || trans('add')}</Typography>}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled} sx={{ borderRadius: 0, border: 0, ...sx }}>
          <AddIcon sx={{ mr: '.1rem', fontSize: '1rem' }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}

Add.defaultProps = { sx: undefined, disabled: false, title: undefined };
