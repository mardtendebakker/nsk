import {
  Button, Box, Tooltip, IconButton, Typography,
  SxProps,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import ConfirmationDialog from '../confirmationDialog';

export default function Delete({
  onClick,
  tooltip = false,
  disabled = false,
  sx,
}: {
  tooltip?: boolean,
  onClick: () => void,
  disabled?: boolean,
  sx?: SxProps
}) {
  const { trans } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Tooltip title={tooltip ? <Typography>{trans('delete')}</Typography> : undefined}>
        <span>
          {tooltip
            ? (
              <IconButton size="small" sx={{ borderRadius: 0, border: 0, ...sx }} onClick={() => setShowDeleteModal(true)} color="error" disabled={disabled}>
                <DeleteIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            )
            : (
              <Button size="small" sx={sx} onClick={() => setShowDeleteModal(true)} variant="outlined" color="error" disabled={disabled}>
                <DeleteIcon />
                {trans('delete')}
              </Button>
            )}
        </span>
      </Tooltip>
      {showDeleteModal && (
      <ConfirmationDialog
        title={(
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DeleteIcon
              color="error"
              sx={{
                mb: '1rem',
                padding: '.5rem',
                fontSize: '2.5rem',
                borderRadius: '50%',
                bgcolor: (theme) => theme.palette.error.light,
              }}
            />
            {trans('deleteResourceQuestion')}
          </Box>
        )}
        content={<>{trans('deleteResourceContent')}</>}
        onConfirm={() => {
          onClick();
          setShowDeleteModal(false);
        }}
        onClose={() => setShowDeleteModal(false)}
        confirmButtonColor="error"
        confirmButtonVariant="outlined"
        confirmButtonText={trans('deleteConfirm')}
      />
      )}
    </>
  );
}
