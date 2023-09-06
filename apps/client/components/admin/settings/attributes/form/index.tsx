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

export default function Form({
  setValue,
  setData,
  formRepresentation,
  disabled,
}: {
  setValue: SetValue,
  setData: (arg0: FormRepresentation) => void,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();

  return (
    <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
      <Grid
        container
        spacing={3}
        sx={{ flexDirection: 'column' }}
      >
        <Grid sx={{ flex: 1, display: 'flex' }} item>
          <TextField
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
            sx={{ mr: '1rem', flex: 0.4, flexGrow: 0.65 }}
            label={trans('attributeForm.name.label')}
            placeholder={trans('attributeForm.name.placeholder')}
            value={formRepresentation.name.value || ''}
            helperText={formRepresentation.name.error}
            error={!!formRepresentation.name.error}
            onChange={(e) => setValue({ field: 'name', value: e.target.value })}
            disabled={disabled}
          />
          { formRepresentation.id.value && (
          <Select
            sx={{ flex: 0.25 }}
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
          )}
          <Checkbox
            disabled={disabled}
            onCheck={(checked) => setValue({ field: 'isPublic', value: checked })}
            checked={formRepresentation.isPublic.value as boolean}
            label={trans('isPublic')}
          />
        </Grid>
        <Grid sx={{ display: 'flex' }} item>
          <DataSourcePicker
            sx={{ flex: 0.5, flexGrow: 1 }}
            multiple
            disabled={disabled}
            url={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
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
            sx={{ flex: 0.5, flexGrow: 1, ml: '1rem' }}
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
            sx={{ flex: 0.5, flexGrow: 1, ml: '1rem' }}
            disabled={disabled}
            url={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
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

Form.defaultProps = { disabled: false };
