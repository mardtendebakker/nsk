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
import { AUTOCOMPLETE_CUSTOMERS_PATH } from '../../../utils/axios';
import Contact from './contact';

export default function CustomerDetails({
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
        {trans('customerDetails')}
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
            <FormLabel sx={{ mb: '.5rem' }}>{trans('customerType')}</FormLabel>
            <RadioGroup
              row
              defaultValue={formRepresentation.newCustomer.value ? 'new' : 'existing'}
              onChange={(e) => setValue({ field: 'newCustomer', value: e.target.value == 'new' })}
              value={formRepresentation.newCustomer.value ? 'new' : 'existing'}
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
          {formRepresentation.newCustomer.value ? (
            <Contact formRepresentation={formRepresentation} setValue={setValue} disabled={disabled} />
          ) : (
            <DataSourcePicker
              label={trans('customer')}
              path={AUTOCOMPLETE_CUSTOMERS_PATH}
              disabled={disabled}
              fullWidth
              placeholder={trans('selectCustomer')}
              onChange={(selected: { id: number }) => setValue({ field: 'customerId', value: selected?.id })}
              value={formRepresentation.customerId.value}
              error={!!formRepresentation.customerId.error}
              helperText={formRepresentation.customerId.error}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
