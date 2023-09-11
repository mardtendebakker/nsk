import {
  Box, Button, MenuItem, Popover, Stack,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EditLocation from '@mui/icons-material/EditLocation';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';

export default function Action({
  disabled,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onChangeLocation,
  onPrint,
  onPrintChecklist,
  onPrintPriceCard,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeLocation: () => void,
  onPrint: () => void,
  onPrintChecklist: () => void,
  onPrintPriceCard: () => void,
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Checkbox
        disabled={disabled}
        checked={allChecked}
        onCheck={onAllCheck}
        label={`${trans('selectAll')} ${checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedProductsCount > 0
        && (
        <Button size="small" onClick={onChangeLocation} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <EditLocation sx={{ mr: '.1rem' }} />
          {trans('changeLocation')}
        </Button>
        )}
        {checkedProductsCount > 0
        && (
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
              </Stack>
            </Popover>
          </>
        )}
      </Box>
    </Box>
  );
}
