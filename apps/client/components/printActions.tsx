import {
  Button, MenuItem, Popover, Stack,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';

export default function PrintActions({
  disabled,
  onPrint,
  onPrintChecklist,
  onPrintPriceCard,
  onPrintLabel,
}:{
  disabled: boolean,
  onPrint: () => void,
  onPrintChecklist: () => void,
  onPrintPriceCard: () => void,
  onPrintLabel: () => void,
}) {
  const { trans } = useTranslation();
  const [showPrintActions, setShowPrintActions] = useState(null);

  const handlePrint = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowPrintActions(event.currentTarget);
  };

  const handleClose = () => {
    setShowPrintActions(null);
  };

  return (
    <>
      <Button size="small" onClick={handlePrint} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
        {trans('print')}
        <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
      </Button>
      <Popover
        open={Boolean(showPrintActions)}
        anchorEl={showPrintActions}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            '& .MuiMenuItem-root': {
              typography: 'body2',
            },
          },
        }}
      >
        <Stack>
          <MenuItem onClick={onPrint} disabled={disabled}>
            {trans('printBarcode')}
          </MenuItem>
          <MenuItem onClick={onPrintChecklist} disabled={disabled}>
            {trans('printChecklist')}
          </MenuItem>
          <MenuItem onClick={onPrintPriceCard} disabled={disabled}>
            {trans('printPriceCard')}
          </MenuItem>
          <MenuItem onClick={onPrintLabel} disabled={disabled}>
            {trans('printLabel')}
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
}
