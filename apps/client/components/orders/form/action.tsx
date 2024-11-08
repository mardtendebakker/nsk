import {
  Box, Button, Popover, Stack, MenuItem, Tooltip,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent, useState } from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import BulkPrintOrder from '../../button/bulkPrintOrder';
import useTranslation from '../../../hooks/useTranslation';
import { OrderType } from '../../../utils/axios/models/types';
import useSecurity from '../../../hooks/useSecurity';

export default function Action({
  id,
  setPerformingPrint,
  onImportFromBlancco,
  onSave,
  disabled,
  type,
}:{
  id?: string,
  setPerformingPrint: (state: boolean) => void,
  onSave: (e: SyntheticEvent) => void,
  onImportFromBlancco?: (e: SyntheticEvent) => void,
  disabled: boolean,
  type: OrderType
}) {
  const { trans } = useTranslation();
  const { hasModule } = useSecurity();
  const [showBlanccoActions, setShowBlanccoActions] = useState(null);

  const handleBlancco = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowBlanccoActions(event.currentTarget);
  };

  const handleClose = () => {
    setShowBlanccoActions(null);
  };

  const hasBlancco = hasModule('blancco');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {id && <BulkPrintOrder ids={[id]} onPerforming={(state:boolean) => setPerformingPrint(state)} type={type} disabled={disabled} sx={{ mr: '.5rem' }} />}
      {id && onImportFromBlancco && (
        <>
          <Tooltip title={!hasBlancco && trans('inactiveModuleMessage', { vars: (new Map()).set('module', 'blancco') })}>
            <span>
              <Button size="small" onClick={handleBlancco} sx={{ mr: '1rem' }} variant="outlined" color="primary" disabled={disabled || !hasBlancco}>
                {trans('blancco.name')}
                <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
              </Button>
            </span>
          </Tooltip>
          <Popover
            open={Boolean(showBlanccoActions)}
            anchorEl={showBlanccoActions}
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
              <MenuItem onClick={onImportFromBlancco} disabled={disabled}>
                {trans('blancco.import')}
              </MenuItem>
            </Stack>
          </Popover>
        </>
      )}
      <Button
        size="small"
        variant="contained"
        onClick={onSave}
        disabled={disabled}
      >
        <Check />
        {trans('save')}
      </Button>
    </Box>
  );
}
