import {
  Checkbox, Grid, Typography, Box,
} from '@mui/material';
import { SetValue, FormRepresentation } from '../../../../../hooks/useForm';
import useTranslation from '../../../../../hooks/useTranslation';
import BorderedBox from '../../../../borderedBox';
import TextField from '../../../../memoizedInput/textField';
import Select from '../../../../memoizedInput/select';
import { PRODUCT_TYPES_PATH } from '../../../../../utils/axios';
import DataSourcePicker from '../../../../memoizedInput/dataSourcePicker';
import Options from './options';

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
        <Grid
          sx={{
            flex: 1, display: 'flex', alignItems: 'baseline', mb: '1rem',
          }}
          item
        >
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
          <Box sx={{ display: 'flex', alignSelf: 'center' }}>
            <Checkbox
              disabled={disabled}
              onChange={(_, checked) => setValue({ field: 'isPublic', value: checked })}
              checked={formRepresentation.isPublic.value as boolean}
            />
            <Typography variant="inherit" sx={{ mt: '.3rem' }}>
              {trans('public')}
            </Typography>
          </Box>
        </Grid>
        <Grid sx={{ mb: '1rem', display: 'flex' }} item>
          <DataSourcePicker
            sx={{ flex: 0.5, flexGrow: 1 }}
            multiple
            disabled={disabled}
            url={PRODUCT_TYPES_PATH.replace(':id', '')}
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
            params={{ attributeOnly: 1 }}
            disabled={disabled}
            url={PRODUCT_TYPES_PATH.replace(':id', '')}
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
