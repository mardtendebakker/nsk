import {
  Box, Grid, IconButton, InputAdornment, Tooltip, Typography,
} from '@mui/material';
import QrCode from '@mui/icons-material/QrCode';
import { SetValue, FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import BorderedBox from '../../borderedBox';
import TextField from '../../memoizedInput/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import {
  AUTOCOMPLETE_PRODUCT_TYPES_PATH, AUTOCOMPLETE_LOCATIONS_PATH, AUTOCOMPLETE_PRODUCT_STATUSES_PATH,
} from '../../../utils/axios';
import AttributeForm, { buildProductTypeKey } from './AttributeForm';
import { price } from '../../../utils/formatter';
import { LocationTemplate } from '../../../utils/axios/models/product';

export default function Form({
  setValue,
  formRepresentation,
  disabled = false,
  onPrintBarcode,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean,
  onPrintBarcode?: () => void
}) {
  const { trans } = useTranslation();

  const calculateListPrice = (): number => {
    if (!formRepresentation.type_id.value) {
      return 0;
    }

    const keys = Object
      .keys(formRepresentation)
      .filter((key) => key.includes(buildProductTypeKey({ id: formRepresentation.type_id.value })));

    return keys.reduce((accumulator, currentValue) => accumulator + (formRepresentation[currentValue].additionalData?.selectedOption?.price || 0), 0);
  };

  return (
    <>
      <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('basicInfo')}
        </Typography>
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.33, mr: '.5rem' }}
              label={trans('productForm.sku.label')}
              placeholder={trans('productForm.sku.placeholder')}
              value={formRepresentation.sku.value || ''}
              onChange={(e) => setValue({ field: 'sku', value: e.target.value })}
              disabled={disabled}
              InputProps={{
                endAdornment: onPrintBarcode && (
                  <InputAdornment position="end">
                    <Tooltip title={trans('printBarcode')}>
                      <IconButton onClick={onPrintBarcode} disableRipple>
                        <QrCode sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ flex: 0.33, mr: '.5rem' }}
              label={trans('productName')}
              placeholder={trans('productName')}
              value={formRepresentation.name.value || ''}
              helperText={formRepresentation.name.error}
              error={!!formRepresentation.name.error}
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
              disabled={disabled}
            />
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              path={AUTOCOMPLETE_PRODUCT_TYPES_PATH}
              label={trans('productType')}
              placeholder={trans('selectProductType')}
              onChange={(selected: { id: number }) => setValue({ field: 'type_id', value: selected?.id })}
              value={formRepresentation.type_id.value?.toString()}
              disabled={disabled}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <DataSourcePicker
              sx={{ flex: 0.33, mr: '.5rem' }}
              path={AUTOCOMPLETE_LOCATIONS_PATH}
              searchKey="name"
              label={trans('location')}
              placeholder={trans('selectLocation')}
              onChange={(selected: { id: number, location_template: LocationTemplate[] }) => {
                setValue({ field: 'location_id', value: selected?.id, additionalData: { location_template: selected?.location_template || [] } });
              }}
              value={formRepresentation.location_id.value?.toString()}
              helperText={formRepresentation.location_id.error}
              error={!!formRepresentation.location_id.error}
              disabled={disabled}
            />
            <TextField
              sx={{ flex: 0.33, mr: '.5rem' }}
              label={trans('locationLabel')}
              placeholder={trans('selectLocationLabel')}
              value={formRepresentation.location_label.value || ''}
              helperText={formRepresentation.location_label.error}
              error={!!formRepresentation.location_label.error}
              onChange={(e) => setValue({ field: 'location_label', value: e.target.value })}
              disabled={disabled || !formRepresentation.location_id.value}
            />
            <DataSourcePicker
              sx={{ flex: 0.33, mr: '.5rem' }}
              path={AUTOCOMPLETE_PRODUCT_STATUSES_PATH}
              label={trans('status')}
              placeholder={trans('selectStatus')}
              onChange={(selected: { id: number }) => setValue({ field: 'status_id', value: selected?.id })}
              value={formRepresentation.status_id.value?.toString()}
              disabled={disabled}
            />
            <Box sx={{ flex: 0.33, display: 'flex', flexDirection: 'column' }}>
              <TextField
                type="number"
                label={trans('retailPrice')}
                placeholder="0.00"
                value={formRepresentation.price.value || '0'}
                InputProps={{
                  startAdornment: (<Box sx={{ mr: '.2rem' }}>€</Box>),
                }}
                onChange={(e) => setValue({ field: 'price', value: e.target.value })}
                disabled={disabled}
              />
              <Typography variant="subtitle2" color="primary" sx={{ mt: '.5rem' }}>
                {trans('listPrice')}
                :
                {' '}
                {price(calculateListPrice())}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              fullWidth
              size="medium"
              multiline
              rows={3}
              label={trans('description')}
              name="description"
              value={formRepresentation.description.value || ''}
              onChange={(e) => setValue({ field: 'description', value: e.target.value })}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </BorderedBox>
      {formRepresentation.type_id.value && (
        <AttributeForm
          setValue={setValue}
          formRepresentation={formRepresentation}
          disabled={disabled}
          productTypeId={formRepresentation.type_id.value}
        />
      )}
    </>
  );
}
