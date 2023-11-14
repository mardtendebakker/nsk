import { Box, Grid } from '@mui/material';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';

export default function Contact(
  {
    formRepresentation,
    setValue,
  }: {
    formRepresentation : FormRepresentation,
    setValue: SetValue
  },
) {
  const { trans } = useTranslation();

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', width: '100%',
        }}
      >
        <TextField
          fullWidth
          label={trans('name')}
          placeholder={trans('name')}
          onChange={(e) => setValue({ field: 'name', value: e.target.value })}
          value={formRepresentation.name.value || ''}
          error={!!formRepresentation.name.error}
          helperText={formRepresentation.name.error}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          label={trans('kvkNr')}
          placeholder={trans('kvkNr')}
          onChange={(e) => setValue({ field: 'kvkNr', value: e.target.value })}
          value={formRepresentation.kvkNr.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          label={trans('representative')}
          placeholder={trans('representative')}
          onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
          value={formRepresentation.representative.value || ''}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', mb: '.5rem', width: '100%',
        }}
      />
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex', mb: '.5rem', width: '100%',
        }}
      >
        <TextField
          fullWidth
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
          label={trans('zipcode')}
          placeholder={trans('zipcode')}
          onChange={(e) => setValue({ field: 'zipcode', value: e.target.value })}
          value={formRepresentation.zipcode.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          label={trans('state')}
          placeholder={trans('state')}
          onChange={(e) => setValue({ field: 'state', value: e.target.value })}
          value={formRepresentation.state.value || ''}
        />
        <Box sx={{ m: '.25rem' }} />
        <TextField
          fullWidth
          label={trans('country')}
          placeholder={trans('country')}
          onChange={(e) => setValue({ field: 'country', value: e.target.value })}
          value={formRepresentation.country.value || ''}
        />
      </Grid>
    </>
  );
}
