import {
  Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography,
} from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { AUTOCOMPLETE_COMPANIES_PATH } from '../../../utils/axios';
import CompanyForm from './companyForm';

export default function Contact(
  {
    formRepresentation,
    setValue,
    disabled,
  }: {
    formRepresentation : FormRepresentation,
    setValue: SetValue
    disabled: boolean,
  },
) {
  const { trans } = useTranslation();

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', mb: '.5rem', width: '100%',
        }}
      >
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('name')}
          placeholder={trans('name')}
          onChange={(e) => setValue({ field: 'name', value: e.target.value })}
          value={formRepresentation.name.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('email')}
          placeholder={trans('example@email.com')}
          type="email"
          onChange={(e) => setValue({ field: 'email', value: e.target.value })}
          value={formRepresentation.email.value || ''}
          error={!!formRepresentation.email.error}
          helperText={formRepresentation.email.error}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('phone')}
          placeholder={trans('0000000000')}
          onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
          value={formRepresentation.phone.value || ''}
          error={!!formRepresentation.phone.error}
          helperText={formRepresentation.phone.error}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', mb: '.5rem', width: '100%',
        }}
      >
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('street')}
          placeholder={trans('street')}
          onChange={(e) => setValue({ field: 'street', value: e.target.value })}
          value={formRepresentation.street.value || ''}
          error={!!formRepresentation.street.error}
          helperText={formRepresentation.street.error}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('extraStreet')}
          placeholder={trans('extraStreet')}
          onChange={(e) => setValue({ field: 'extraStreet', value: e.target.value })}
          value={formRepresentation.extraStreet.value || ''}
          error={!!formRepresentation.extraStreet.error}
          helperText={formRepresentation.extraStreet.error}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('city')}
          placeholder={trans('city')}
          onChange={(e) => setValue({ field: 'city', value: e.target.value })}
          value={formRepresentation.city.value || ''}
          error={!!formRepresentation.city.error}
          helperText={formRepresentation.city.error}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', mb: '.5rem', width: '100%',
        }}
      >
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('zipcode')}
          placeholder={trans('zipcode')}
          onChange={(e) => setValue({ field: 'zipcode', value: e.target.value })}
          value={formRepresentation.zipcode.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('state')}
          placeholder={trans('state')}
          onChange={(e) => setValue({ field: 'state', value: e.target.value })}
          value={formRepresentation.state.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          disabled={disabled}
          label={trans('country')}
          placeholder={trans('country')}
          onChange={(e) => setValue({ field: 'country', value: e.target.value })}
          value={formRepresentation.country.value || ''}
        />
      </Grid>
      <Typography
        sx={{ my: '1rem' }}
        variant="h5"
      >
        {trans('company')}
      </Typography>

      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', flex: 1, alignItems: 'center', mb: '.5rem',
        }}
      >
        <FormControl sx={{ flex: 1 }}>
          <RadioGroup
            row
            defaultValue={formRepresentation.newCompany.value ? 'new' : 'existing'}
            onChange={(e) => setValue({ field: 'newCompany', value: e.target.value == 'new' })}
            value={formRepresentation.newCompany.value ? 'new' : 'existing'}
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
      <Grid item xs={12}>
        {formRepresentation.newCompany.value
          ? (
            <CompanyForm
              formRepresentation={formRepresentation}
              disabled={disabled}
              setValue={setValue}
            />
          ) : (
            <DataSourcePicker
              fullWidth
              disabled={disabled}
              path={AUTOCOMPLETE_COMPANIES_PATH}
              label={trans('company')}
              placeholder={trans('selectCompany')}
              onChange={(value: { id: number }) => {
                setValue({ field: 'companyId', value: value?.id });
              }}
              value={formRepresentation.companyId.value}
              error={Boolean(formRepresentation.companyId.error)}
              helperText={formRepresentation.companyId.error}
            />
          )}
      </Grid>
    </>
  );
}
