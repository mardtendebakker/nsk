import { APRODUCT_BULK_PRINT_PRICECARDS, AxiosResponse } from '../../utils/axios';
import { openBlob } from '../../utils/blob';
import useAxios from '../useAxios';

export default function useBulkPrintPriceCards({ withProgressBar }: { withProgressBar: boolean }): { printPriceCards: (ids: number[])=> void, performing: boolean } {
  const { call, performing } = useAxios('get', APRODUCT_BULK_PRINT_PRICECARDS, { withProgressBar });

  const printPriceCards = (ids: number[]) => {
    call({ params: { ids }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        openBlob(response.data);
      });
  };

  return {
    printPriceCards,
    performing,
  };
}
