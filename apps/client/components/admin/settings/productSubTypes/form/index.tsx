import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_PRODUCT_TYPES_PATH } from '../../../../../utils/axios';

export default function Form({
  setValue,
  formRepresentation,
  disabled = false,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox sx={{ maxWidth: '40rem', p: '1rem' }}>
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('productSubTypeForm.name.label')}
        placeholder={trans('productSubTypeForm.name.placeholder')}
        value={formRepresentation.name.value || ''}
        helperText={formRepresentation.name.error}
        error={!!formRepresentation.name.error}
        onChange={(e) => setValue({ field: 'name', value: e.target.value })}
        disabled={disabled}
      />
      <DataSourcePicker
        sx={{ mb: '1rem' }}
        disabled={disabled}
        path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
        fullWidth
        label={trans('productSubTypeForm.productType.label')}
        placeholder={trans('productSubTypeForm.productType.placeholder')}
        onChange={(selected: { id: number }) => setValue({ field: 'product_type_id', value: selected?.id })}
        value={formRepresentation.product_type_id.value?.toString()}
      />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('productSubTypeForm.magentoCategoryId.label')}
        placeholder={trans('productSubTypeForm.magentoCategoryId.placeholder')}
        value={formRepresentation.magento_category_id.value || ''}
        helperText={formRepresentation.magento_category_id.error}
        error={!!formRepresentation.magento_category_id.error}
        onChange={(e) => setValue({ field: 'magento_category_id', value: e.target.value })}
        disabled={disabled}
      />
      <TextField
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('productSubTypeForm.magentoAttrSetId.label')}
        placeholder={trans('productSubTypeForm.magentoAttrSetId.placeholder')}
        value={formRepresentation.magento_attr_set_id.value || ''}
        helperText={formRepresentation.magento_attr_set_id.error}
        error={!!formRepresentation.magento_attr_set_id.error}
        onChange={(e) => setValue({ field: 'magento_attr_set_id', value: e.target.value })}
        disabled={disabled}
      />
      <TextField
        type="number"
        sx={{ mb: '1rem' }}
        fullWidth
        label={trans('productSubTypeForm.pindex.label')}
        placeholder={trans('productSubTypeForm.pindex.placeholder')}
        value={formRepresentation.pindex.value || ''}
        helperText={formRepresentation.pindex.error}
        error={!!formRepresentation.pindex.error}
        onChange={(e) => setValue({ field: 'pindex', value: e.target.value ? parseInt(e.target.value, 10) : null })}
        disabled={disabled}
      />
    </BorderedBox>
  );
}
