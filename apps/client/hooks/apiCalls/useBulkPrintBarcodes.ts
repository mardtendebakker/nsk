import { APRODUCT_BULK_PRINT_BARCODES, AxiosResponse } from '../../utils/axios';
import { openBlob } from '../../utils/blob';
import useAxios from '../useAxios';

export default function useBulkPrintBarcodes({ withProgressBar }: { withProgressBar: boolean }): { printBarcodes: (ids: number[])=> void, performing: boolean } {
  const { call, performing } = useAxios('get', APRODUCT_BULK_PRINT_BARCODES, { withProgressBar });

  const printBarcodes = (ids: number[]) => {
    call({ params: { ids }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  return {
    printBarcodes,
    performing,
  };
}
