import { Button, Box, SxProps } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import ConfirmationDialog from '../confirmationDialog';
import useAxios from '../../hooks/useAxios';

export default function CreateExacteInvoice({
  orderId,
  disabled = false,
  onPerforming,
  sx,
  content,
}: {
  orderId: number;
  disabled?: boolean;
  onPerforming: (state: boolean) => void;
  sx?: SxProps;
  content: JSX.Element;
}) {
  const { call } = useAxios('post', `/sales/${orderId}/request-exact-invoice`, {
    withProgressBar: true,
  });

  const { trans } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleCreateInvoice = async () => {
    onPerforming(true);
    try {
      await call();
    } finally {
      onPerforming(false);
    }
  };

  return (
    <>
      <Button
        size="small"
        sx={sx}
        onClick={() => setShowModal(true)}
        variant="outlined"
        color="success"
        disabled={disabled}
      >
        {trans('createInvoice')}
      </Button>
      {showModal && (
        <ConfirmationDialog
          title={
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <WarningIcon
                color="warning"
                sx={{
                  mb: '1rem',
                  padding: '.5rem',
                  fontSize: '2.5rem',
                  borderRadius: '50%',
                  bgcolor: (theme) => theme.palette.warning.light,
                }}
              />
              {trans('createInvoiceConfirmationQuestion')}
            </Box>
          }
          content={content}
          onConfirm={() => {
            handleCreateInvoice();
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
          confirmButtonColor="error"
          confirmButtonVariant="outlined"
          confirmButtonText={trans('confirm')}
        />
      )}
    </>
  );
}
