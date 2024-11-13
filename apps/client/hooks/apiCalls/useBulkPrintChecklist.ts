import { APRODUCT_BULK_PRINT_CHECKLISTS, AxiosResponse } from '../../utils/axios';
import { openBlob } from '../../utils/blob';
import useAxios from '../useAxios';

export default function useBulkPrintChecklist({ withProgressBar }: { withProgressBar: boolean }): { printChecklists: (ids: number[])=> void, performing: boolean } {
  const { call, performing } = useAxios('get', APRODUCT_BULK_PRINT_CHECKLISTS, { withProgressBar });

  const printChecklists = (ids: number[]) => {
    call({ params: { ids }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  return {
    printChecklists,
    performing,
  };
}
