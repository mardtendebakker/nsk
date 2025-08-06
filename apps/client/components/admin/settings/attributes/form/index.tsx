import { Grid } from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import Select from '../../../../memoizedInput/select';
import { AUTOCOMPLETE_PRODUCT_TYPES_PATH } from '../../../../../utils/axios';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import Options from './options';
import Checkbox from '../../../../checkbox';
import useResponsive from '../../../../../hooks/useResponsive';

export default function Form({
  setValue,
  setData,
  formRepresentation,
  disabled = false,
}: {
  setValue: SetValue,
  setData: (arg0: FormRepresentation) => void,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  return (
    <BorderedBox sx={{ width: isDesktop ? '40rem' : undefined, p: '1rem' }}>
      <Grid
        container
        spacing={1}
        sx={{ flexDirection: 'column' }}
      >
        <Grid sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} item>
          <TextField
            fullWidth
            sx={{ mr: '1rem', flex: 0.25 }}
            label={trans('attributeForm.code.label')}
            placeholder={trans('attributeForm.code.placeholder')}
            value={formRepresentation.code.value || ''}
            helperText={formRepresentation.code.error}
            error={!!formRepresentation.code.error}
            onChange={(e) => setValue({ field: 'code', value: e.target.value })}
            disabled={disabled}
          />
          <TextField
            fullWidth
            sx={{
              mr: '1rem', flex: 0.2, flexGrow: 0.65, mt: '.5rem',
            }}
            label={trans('attributeForm.name.label')}
            placeholder={trans('attributeForm.name.placeholder')}
            value={formRepresentation.name.value || ''}
            helperText={formRepresentation.name.error}
            error={!!formRepresentation.name.error}
            onChange={(e) => setValue({ field: 'name', value: e.target.value })}
            disabled={disabled}
          />
          <TextField
            fullWidth
            sx={{
              mr: '1rem', flex: 0.2, flexGrow: 0.65, mt: '.5rem',
            }}
            label={trans('attributeForm.magentoAttrCode.label')}
            placeholder={trans('attributeForm.magentoAttrCode.placeholder')}
            value={formRepresentation.magento_attr_code.value || ''}
            helperText={formRepresentation.magento_attr_code.error}
            error={!!formRepresentation.magento_attr_code.error}
            onChange={(e) => setValue({ field: 'magento_attr_code', value: e.target.value })}
            disabled={disabled}
          />
          <Select
            sx={{ flex: 0.25, mt: '.5rem' }}
            value={formRepresentation.type.value}
            onChange={(e) => setValue({ field: 'type', value: e.target.value })}
            options={[
              { title: trans('text'), value: 0 },
              { title: trans('select'), value: 1 },
              { title: trans('file'), value: 2 },
              { title: trans('product'), value: 3 },
            ]}
            label={trans('attributeForm.type.label')}
          />
          <Checkbox
            disabled={disabled}
            onCheck={(checked) => setValue({ field: 'isPublic', value: checked })}
            checked={formRepresentation.isPublic.value as boolean}
            label={trans('isPublic')}
          />
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column' }} item>
          <DataSourcePicker
            sx={{ flex: 0.5, flexGrow: 1, mt: '.5rem' }}
            multiple
            disabled={disabled}
            path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
            fullWidth
            label={trans('attributeForm.productTypes.label')}
            placeholder={trans('attributeForm.productTypes.placeholder')}
            onChange={(value: { id: number }[]) => {
              setValue({ field: 'productTypes', value: value.map(({ id }) => id) });
            }}
            value={formRepresentation.productTypes.value}
          />
          {(formRepresentation.type.value === 2 || formRepresentation.type.value === 0)
          && (
          <TextField
            fullWidth
            sx={{ flex: 0.5, flexGrow: 1, mt: '.5rem' }}
            type="number"
            value={formRepresentation.price.value || ''}
            placeholder="0.00"
            label={trans('price')}
            onChange={(e) => {
              setValue({ field: 'price', value: e.target.value });
            }}
          />
          )}
          {formRepresentation.type.value === 3
          && (
          <DataSourcePicker
            sx={{ flex: 0.5, flexGrow: 1, mt: '.5rem' }}
            disabled={disabled}
            path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
            label={trans('attributeForm.productType.label')}
            placeholder={trans('attributeForm.productType.placeholder')}
            onChange={(value: { id: number }) => {
              setValue({ field: 'productTypeId', value: value?.id });
            }}
            value={formRepresentation.productTypeId.value}
          />
          )}
        </Grid>
        <Grid item sx={{ flex: 1 }}>
          {formRepresentation.type.value === 1 && <Options setValue={setValue} setData={setData} formRepresentation={formRepresentation} disabled={disabled} />}
        </Grid>

      </Grid>
    </BorderedBox>
  );
}
