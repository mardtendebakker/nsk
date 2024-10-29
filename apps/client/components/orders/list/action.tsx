import {
  Box, Button, MenuItem, Popover, Stack,
} from '@mui/material';
import Loop from '@mui/icons-material/Loop';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import Checkbox from '../../checkbox';
import Can from '../../can';
import { OrderPrint } from '../../../utils/axios/models/types';

export default function Action({
  disabled,
  allChecked,
  checkedOrdersCount,
  onAllCheck,
  onChangeStatus,
  onPrints,
}:{
  disabled: boolean,
  allChecked: boolean,
  checkedOrdersCount: number,
  onAllCheck: (checked: boolean) => void,
  onChangeStatus: () => void,
  onPrints: OrderPrint[],
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
        label={`${trans('selectAll')} ${checkedOrdersCount > 0 ? `(${checkedOrdersCount} ${trans('selected')})` : ''}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {checkedOrdersCount > 0
        && (
          <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
            <Button size="small" onClick={onChangeStatus} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled}>
              <Loop sx={{ mr: '.1rem' }} />
              {trans('changeStatus')}
            </Button>
          </Can>
        )}
        {checkedOrdersCount > 0
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
                {onPrints?.map((onPrint) => (
                  <MenuItem onClick={onPrint.onClick} disabled={disabled}>
                    {trans(onPrint.transKey)}
                  </MenuItem>
                ))}
              </Stack>
            </Popover>
          </>
        )}
      </Box>
    </Box>
  );
}
