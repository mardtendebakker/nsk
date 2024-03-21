import {
  Box, Button, MenuItem, Popover, Stack,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EditLocation from '@mui/icons-material/EditLocation';
import Archive from '@mui/icons-material/Archive';
import Unarchive from '@mui/icons-material/Unarchive';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';

export default function Action({
  disabled,
  type,
  allChecked,
  checkedProductsCount,
  onAllCheck,
  onArchive,
  onUnarchive,
  onChangeLocation,
  onPrint,
  onPrintChecklist,
  onPrintPriceCard,
  onPrintLabel,
}:{
  disabled: boolean,
  type: 'product' | 'repair' | 'archived',
  allChecked: boolean,
  checkedProductsCount: number,
  onAllCheck: (checked: boolean) => void,
  onArchive: () => void,
  onUnarchive: () => void,
  onChangeLocation: () => void,
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Checkbox
        disabled={disabled}
        checked={allChecked}
        onCheck={onAllCheck}
        label={`${trans('selectAll')} ${checkedProductsCount > 0 ? `(${checkedProductsCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedProductsCount > 0 && type !== 'archived'
        && (
        <Button size="small" onClick={onArchive} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Archive sx={{ mr: '.1rem' }} />
          {trans('archive')}
        </Button>
        )}
        {checkedProductsCount > 0 && type === 'archived'
        && (
        <Button size="small" onClick={onUnarchive} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
          <Unarchive sx={{ mr: '.1rem' }} />
          {trans('unarchive')}
        </Button>
        )}
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
                <MenuItem onClick={onPrintLabel} disabled={disabled}>
                  {trans('printLebel')}
                </MenuItem>
              </Stack>
            </Popover>
          </>
        )}
      </Box>
    </Box>
  );
}
