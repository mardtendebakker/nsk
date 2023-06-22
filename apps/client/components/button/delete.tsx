import {
  Button, Box, Tooltip, IconButton, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import ConfirmationDialog from '../confirmationDialog';

export default function Delete({
  tooltip,
  onDelete,
  disabled,
  borderless,
}: {
  tooltip?: boolean,
  onDelete: () => void,
  disabled: boolean,
  borderless?: boolean
}) {
  const { trans } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Tooltip title={tooltip ? <Typography>{trans('delete')}</Typography> : undefined}>
        {tooltip
          ? (
            <IconButton sx={{ borderRadius: 0, border: borderless ? '0px' : '1px solid' }} onClick={() => setShowDeleteModal(true)} color="error" disabled={disabled}>
              <DeleteIcon />
            </IconButton>
          )
          : (
            <Button onClick={() => setShowDeleteModal(true)} variant="outlined" color="error" disabled={disabled}>
              <DeleteIcon />
              {trans('delete')}
            </Button>
          )}
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
          onDelete();
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

Delete.defaultProps = { tooltip: false, borderless: false };
