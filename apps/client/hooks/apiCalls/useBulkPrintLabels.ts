import { APRODUCT_BULK_PRINT_LABELS, AxiosResponse } from '../../utils/axios';
import { openBlob } from '../../utils/blob';
import useAxios from '../useAxios';

export default function useBulkPrintLabels({ withProgressBar }: { withProgressBar: boolean }): { printLabels: (ids: number[])=> void, performing: boolean } {
  const { call, performing } = useAxios('get', APRODUCT_BULK_PRINT_LABELS, { withProgressBar });

  const printLabels = (ids: number[]) => {
    call({ params: { ids }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  return {
    printLabels,
    performing,
  };
}
