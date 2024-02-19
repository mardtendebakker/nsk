import { Box, Button } from '@mui/material';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import BulkPrintOrder from '../../button/bulkPrintOrder';
import useTranslation from '../../../hooks/useTranslation';
import { OrderType } from '../../../utils/axios/models/types';

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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {id && <BulkPrintOrder ids={[id]} onPerforming={(state:boolean) => setPerformingPrint(state)} type={type} disabled={disabled} sx={{ mr: '.5rem' }} />}
      {id && onImportFromBlancco && <Button size="small" variant="outlined" onClick={onImportFromBlancco} disabled={disabled} sx={{ mr: '.5rem' }}>{trans('importFromBlancco')}</Button>}
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

Action.defaultProps = {
  id: undefined,
  onImportFromBlancco: undefined,
};
