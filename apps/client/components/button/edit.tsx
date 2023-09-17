import {
  SxProps, Tooltip, Typography, IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useTranslation from '../../hooks/useTranslation';

export default function Edit({
  onClick,
  disabled,
  sx,
  href,
}: { onClick?: () => void, disabled?: boolean, sx?: SxProps, href?:string }) {
  const { trans } = useTranslation();

  return (
    <Tooltip title={<Typography>{trans('edit')}</Typography>}>
      <span>
        <IconButton href={href} size="small" onClick={onClick} disabled={disabled} sx={{ borderRadius: 0, border: 0, ...sx }}>
          <EditIcon sx={{ mr: '.1rem', fontSize: '1rem' }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}

Edit.defaultProps = {
  sx: undefined, disabled: false, onClick: undefined, href: undefined,
};
