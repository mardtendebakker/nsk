import { Grid, Typography } from '@mui/material';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import ProductAvailabilityPicker from '../../memoizedInput/productAvailabilityPicker';
import useTranslation from '../../../hooks/useTranslation';
import BorderedBox from '../../borderedBox';
import TextField from '../../memoizedInput/textField';
import ProductLocationPicker from '../../memoizedInput/productLocationPicker';

export default function ProductForm({
  setValue,
  formRepresentation,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
}) {
  const { trans } = useTranslation();

  return (
    <form>
      <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('basicInfo')}
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              label={trans('sku')}
              name="sku"
              onChange={(e) => setValue({ field: 'sku', value: e.target.value })}
            />
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              label={trans('productName')}
              name="name"
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
            />
            <TextField
              sx={{ flex: 0.33 }}
              label={trans('productType')}
              name="type"
              onChange={(e) => setValue({ field: 'type', value: e.target.value })}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <ProductLocationPicker sx={{ flex: 0.33, mr: '1rem' }} placeholder="" />
            <ProductAvailabilityPicker sx={{ flex: 0.33, mr: '1rem' }} placeholder="" />
            <TextField
              sx={{ flex: 0.33 }}
              label={trans('price')}
              name="price"
              value="€"
              onChange={(e) => setValue({ field: 'price', value: e.target.value })}
            />
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
              onChange={(e) => setValue({ field: 'description', value: e.target.value })}
            />
          </Grid>
        </Grid>
      </BorderedBox>
      <BorderedBox sx={{ width: '80rem', p: '1rem', mt: '1.5rem' }}>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('productInfo')}
          <br />
          <b style={{ color: 'red' }}>Design needs to be discussed with shayan</b>
        </Typography>
      </BorderedBox>
    </form>
  );
}
