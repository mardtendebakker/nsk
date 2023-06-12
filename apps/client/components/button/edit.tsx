import {
  SxProps, Tooltip, Typography, IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useTranslation from '../../hooks/useTranslation';

export default function Edit({ onClick, disabled, sx }: { onClick: () => void, disabled?: boolean, sx?: SxProps }) {
  const { trans } = useTranslation();

  return (
    <Tooltip title={<Typography>{trans('edit')}</Typography>}>
      <IconButton onClick={onClick} disabled={disabled} sx={{ borderRadius: 0, border: '1px solid', ...sx }}>
        <EditIcon sx={{ mr: '.1rem' }} />
      </IconButton>
    </Tooltip>
  );
}

Edit.defaultProps = { sx: undefined, disabled: false };
