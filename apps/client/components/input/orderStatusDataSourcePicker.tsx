import useTranslation from '../../hooks/useTranslation';
import DataSourcePicker, { DataSourcePickerProps } from './dataSourcePicker';
import { OrderType } from '../../utils/axios/models/types';
import {
  AUTOCOMPLETE_PURCHASE_STATUSES_PATH,
  AUTOCOMPLETE_REPAIR_STATUSES_PATH,
  AUTOCOMPLETE_SALE_STATUSES_PATH,
} from '../../utils/axios/paths';

const AUTOCOMPLETE_ORDER_STATUSES = {
  purchase: AUTOCOMPLETE_PURCHASE_STATUSES_PATH,
  sales: AUTOCOMPLETE_SALE_STATUSES_PATH,
  repair: AUTOCOMPLETE_REPAIR_STATUSES_PATH,
};

export default function OrderStatusDataSourcePicker(
  props: Omit<DataSourcePickerProps, 'path'> & { type: OrderType }
) {
  const { type } = props;
  const { locale } = useTranslation();
  const path = AUTOCOMPLETE_ORDER_STATUSES[type];

  return (
    <DataSourcePicker
      {...props}
      path={path}
      formatter={(object: {
        id: number;
        label: string;
        translations: [key: string, value: string];
      }) => ({
        id: object.id,
        label: object?.translations?.[locale] || object.label,
      })}
    />
  );
}
