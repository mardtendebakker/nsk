import { Button, SxProps } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import useTranslation from '../../hooks/useTranslation';
import useAxios from '../../hooks/useAxios';
import { OrderType } from '../../utils/axios/models/types';
import {
  AxiosResponse, BULK_PRINT_NORMAL_PURCHASES_PATH, BULK_PRINT_NORMAL_REPAIRS_PATH, BULK_PRINT_NORMAL_SALES_PATH,
} from '../../utils/axios';
import { openBlob } from '../../utils/blob';

const AJAX_BULK_PRINT_PATHS = {
  purchase: BULK_PRINT_NORMAL_PURCHASES_PATH,
  sales: BULK_PRINT_NORMAL_SALES_PATH,
  repair: BULK_PRINT_NORMAL_REPAIRS_PATH,
};

export default function BulkPrintOrder({
  sx,
  disabled,
  onPerforming,
  type,
  ids,
}:{
  sx?: SxProps,
  disabled?: boolean
  onPerforming: (state: boolean) => void,
  type: OrderType,
  ids: string[]
}) {
  const { trans } = useTranslation();

  const { call } = useAxios(
    'get',
    AJAX_BULK_PRINT_PATHS[type],
    { withProgressBar: true },
  );

  const handlePrint = () => {
    onPerforming(true);
    call({ params: { ids }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      }).finally(() => {
        onPerforming(false);
      });
  };

  return (
    <Button size="small" onClick={handlePrint} sx={sx} variant="outlined" color="primary" disabled={disabled}>
      {trans('print')}
      <ChevronRight sx={{ transform: 'rotate(90deg)' }} />
    </Button>
  );
}
