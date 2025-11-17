import useTranslation from '../../hooks/useTranslation';
import DataSourcePicker, { DataSourcePickerProps } from './dataSourcePicker';
import { AUTOCOMPLETE_PRODUCT_STATUSES_PATH } from '../../utils/axios/paths';

export default function ProductStatusDataSourcePicker(
  props: Omit<DataSourcePickerProps, 'path'>
) {
  const { locale } = useTranslation();

  return (
    <DataSourcePicker
      {...props}
      path={AUTOCOMPLETE_PRODUCT_STATUSES_PATH}
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
