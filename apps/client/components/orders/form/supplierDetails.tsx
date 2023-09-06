import {
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_SUPPLIERS_PATH } from '../../../utils/axios';
import Company from './company';

export default function SupplierDetails({
  formRepresentation,
  disabled,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Typography
        sx={{ mb: '1rem' }}
        variant="h4"
      >
        {trans('supplierDetails')}
      </Typography>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
        >
          <FormControl sx={{ flex: 1 }}>
            <FormLabel sx={{ mb: '.5rem' }}>{trans('supplierType')}</FormLabel>
            <RadioGroup
              row
              defaultValue={formRepresentation.newSupplier.value ? 'new' : 'existing'}
              onChange={(e) => setValue({ field: 'newSupplier', value: e.target.value == 'new' })}
              value={formRepresentation.newSupplier.value ? 'new' : 'existing'}
            >
              {
        [
          {
            label: trans('existing'),
            value: 'existing',
          },
          {
            label: trans('new'),
            value: 'new',
          },
        ].map((element: { label: string, value: string }, i) => (
          <FormControlLabel
            key={element.value}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.text.disabled}`,
              borderRadius: '.5rem',
              mr: 0,
              ml: i === 0 ? 'unset' : '1rem',
              flex: 1,
            })}
            labelPlacement="end"
            control={<Radio value={element.value} />}
            label={element.label}
          />
        ))
        }
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column',
          }}
        >
          {formRepresentation.newSupplier.value ? (
            <Company formRepresentation={formRepresentation} setValue={setValue} />
          ) : (
            <DataSourcePicker
              url={AUTOCOMPLETE_SUPPLIERS_PATH}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectSupplier')}
              onChange={(selected: { id: number }) => setValue({ field: 'supplierId', value: selected?.id })}
              value={formRepresentation.supplierId.value}
              error={!!formRepresentation.supplierId.error}
              helperText={formRepresentation.supplierId.error}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
