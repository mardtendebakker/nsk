import {
  SxProps, Tooltip, Typography, IconButton,
} from '@mui/material';
import Bolt from '@mui/icons-material/Bolt';
import useTranslation from '../../hooks/useTranslation';

export default function Split({
  onClick, sx, disabled = false,
}: { onClick: () => void, disabled?: boolean, sx?: SxProps }) {
  const { trans } = useTranslation();

  return (
    <Tooltip title={<Typography>{trans('split')}</Typography>}>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled} sx={{ borderRadius: 0, border: 0, ...sx }}>
          <Bolt sx={{ mr: '.1rem', fontSize: '1rem' }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
