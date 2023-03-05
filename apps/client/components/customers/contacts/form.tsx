import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField as BaseTextField,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedFormInput/TextField';
import Autocomplete from '../../memoizedFormInput/Autocomplete';

function Form({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('basicDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.33, mr: '1rem' }}
                error={Boolean(formRepresentation.name.error)}
                helperText={formRepresentation.name.error}
                label={trans('newContactForm.name.label')}
                placeholder={trans('newContactForm.name.placeholder')}
                name="name"
                onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                value={formRepresentation.name.value}
              />
              <TextField
                sx={{ flex: 0.33, mr: '1rem' }}
                error={Boolean(formRepresentation.kvk_nr.error)}
                helperText={formRepresentation.kvk_nr.error}
                label={trans('newContactForm.kvkNr.label')}
                placeholder={trans('newContactForm.kvkNr.placeholder')}
                name="kvk_nr"
                onChange={(e) => setValue({ field: 'kvk_nr', value: e.target.value })}
                value={formRepresentation.kvk_nr.value}
              />
              <TextField
                sx={{ flex: 0.33 }}
                error={Boolean(formRepresentation.representative.error)}
                helperText={formRepresentation.representative.error}
                label={trans('newContactForm.representative.label')}
                placeholder={trans('newContactForm.representative.placeholder')}
                name="representative"
                onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
                value={formRepresentation.representative.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.5, mr: '1rem' }}
                error={Boolean(formRepresentation.email.error)}
                helperText={formRepresentation.email.error}
                label={trans('newContactForm.email.label')}
                placeholder={trans('newContactForm.email.placeholder')}
                name="email"
                type="email"
                onChange={(e) => setValue({ field: 'email', value: e.target.value })}
                value={formRepresentation.email.value}
              />
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.phone.error)}
                helperText={formRepresentation.phone.error}
                label={trans('newContactForm.phone.label')}
                placeholder={trans('newContactForm.phone.placeholder')}
                name="phone"
                onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
                value={formRepresentation.phone.value}
              />
              <TextField
                sx={{ flex: 0.25 }}
                error={Boolean(formRepresentation.phone2.error)}
                helperText={formRepresentation.phone2.error}
                label={trans('newContactForm.phone2.label')}
                placeholder={trans('newContactForm.phone2.placeholder')}
                name="phone2"
                onChange={(e) => setValue({ field: 'phone2', value: e.target.value })}
                value={formRepresentation.phone2.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <Autocomplete
                sx={{ flex: 0.66, mr: '1rem' }}
                multiple
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('newContactForm.list.label')}
                    placeholder={trans('newContactForm.list.placeholder')}
                  />
                )
               }
              />
              <Autocomplete
                sx={{ flex: 0.33 }}
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('newContactForm.tag.label')}
                    placeholder={trans('newContactForm.tag.placeholder')}
                  />
                )
               }
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('addressDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.5, mr: '1rem' }}
                error={Boolean(formRepresentation.street.error)}
                helperText={formRepresentation.street.error}
                label={trans('newContactForm.street.label')}
                placeholder={trans('newContactForm.street.placeholder')}
                name="street"
                onChange={(e) => setValue({ field: 'street', value: e.target.value })}
                value={formRepresentation.street.value}
              />
              <TextField
                sx={{ flex: 0.5 }}
                error={Boolean(formRepresentation.street_extra.error)}
                helperText={formRepresentation.street_extra.error}
                label={trans('newContactForm.extraStreet.label')}
                placeholder={trans('newContactForm.extraStreet.placeholder')}
                name="street_extra"
                onChange={(e) => setValue({ field: 'street_extra', value: e.target.value })}
                value={formRepresentation.street_extra.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.city.error)}
                helperText={formRepresentation.city.error}
                label={trans('newContactForm.city.label')}
                placeholder={trans('newContactForm.city.placeholder')}
                name="city"
                onChange={(e) => setValue({ field: 'city', value: e.target.value })}
                value={formRepresentation.city.value}
              />
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.zip.error)}
                helperText={formRepresentation.zip.error}
                label={trans('newContactForm.zipcode.label')}
                placeholder={trans('newContactForm.zipcode.placeholder')}
                name="zip"
                onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
                value={formRepresentation.zip.value}
              />
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.state.error)}
                helperText={formRepresentation.state.error}
                label={trans('newContactForm.state.label')}
                placeholder={trans('newContactForm.state.placeholder')}
                name="state"
                onChange={(e) => setValue({ field: 'state', value: e.target.value })}
                value={formRepresentation.state.value}
              />
              <TextField
                sx={{ flex: 0.25 }}
                error={Boolean(formRepresentation.country.error)}
                helperText={formRepresentation.country.error}
                label={trans('newContactForm.country.label')}
                placeholder={trans('newContactForm.country.placeholder')}
                name="country"
                onChange={(e) => setValue({ field: 'country', value: e.target.value })}
                value={formRepresentation.country.value}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('optionalAddressDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.5, mr: '1rem' }}
                error={Boolean(formRepresentation.street2.error)}
                helperText={formRepresentation.street2.error}
                label={trans('newContactForm.street.label')}
                placeholder={trans('newContactForm.street.placeholder')}
                name="street2"
                onChange={(e) => setValue({ field: 'street2', value: e.target.value })}
                value={formRepresentation.street2.value}
              />
              <TextField
                sx={{ flex: 0.5 }}
                error={Boolean(formRepresentation.street_extra2.error)}
                helperText={formRepresentation.street_extra2.error}
                label={trans('newContactForm.extraStreet.label')}
                placeholder={trans('newContactForm.extraStreet.placeholder')}
                name="street_extra2"
                onChange={(e) => setValue({ field: 'street_extra2', value: e.target.value })}
                value={formRepresentation.street_extra2.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' } }}
            >
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.city2.error)}
                helperText={formRepresentation.city2.error}
                label={trans('newContactForm.city.label')}
                placeholder={trans('newContactForm.city.placeholder')}
                name="city2"
                onChange={(e) => setValue({ field: 'city2', value: e.target.value })}
                value={formRepresentation.city2.value}
              />
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.zip2.error)}
                helperText={formRepresentation.zip2.error}
                label={trans('newContactForm.zipcode.label')}
                placeholder={trans('newContactForm.zipcode.placeholder')}
                name="zip2"
                onChange={(e) => setValue({ field: 'zip2', value: e.target.value })}
                value={formRepresentation.zip2.value}
              />
              <TextField
                sx={{ flex: 0.25, mr: '1rem' }}
                error={Boolean(formRepresentation.state2.error)}
                helperText={formRepresentation.state2.error}
                label={trans('newContactForm.state.label')}
                placeholder={trans('newContactForm.state.placeholder')}
                name="state2"
                onChange={(e) => setValue({ field: 'state2', value: e.target.value })}
                value={formRepresentation.state2.value}
              />
              <TextField
                sx={{ flex: 0.25 }}
                error={Boolean(formRepresentation.country2.error)}
                helperText={formRepresentation.country2.error}
                label={trans('newContactForm.country.label')}
                placeholder={trans('newContactForm.country.placeholder')}
                name="country2"
                onChange={(e) => setValue({ field: 'country2', value: e.target.value })}
                value={formRepresentation.country2.value}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}

export default Form;
