import {
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_SUPPLIERS_PATH } from '../../../utils/axios';
import Contact from './contact';

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
        spacing={1}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
        >
          <FormControl sx={{ flex: 1 }}>
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
              ml: i === 0 ? 'unset' : '.5rem',
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
            display: 'flex', flex: 1, flexDirection: 'column',
          }}
        >
          {formRepresentation.newSupplier.value ? (
            <Contact formRepresentation={formRepresentation} setValue={setValue} disabled={disabled} />
          ) : (
            <DataSourcePicker
              label={trans('supplier')}
              path={AUTOCOMPLETE_SUPPLIERS_PATH}
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
