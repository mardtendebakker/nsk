import { Box, Button } from '@mui/material';
import Check from '@mui/icons-material/Check';
import { SyntheticEvent } from 'react';
import BulkPrintOrder from '../../button/bulkPrintOrder';
import useTranslation from '../../../hooks/useTranslation';
import { OrderType } from '../../../utils/axios/models/types';

export default function Action({
  id,
  setPerformingPrint,
  onSave,
  disabled,
  type,
}:{
  id?: string,
  setPerformingPrint: (state: boolean) => void,
  onSave: (e: SyntheticEvent) => void,
  disabled: boolean,
  type: OrderType
}) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {id && <BulkPrintOrder ids={[id]} onPerforming={(state:boolean) => setPerformingPrint(state)} type={type} disabled={disabled} sx={{ mr: '.5rem' }} />}
      <Button
        size="small"
        variant="contained"
        onClick={onSave}
      >
        <Check />
        {trans('save')}
      </Button>
    </Box>
  );
}

Action.defaultProps = {
  id: undefined,
};
