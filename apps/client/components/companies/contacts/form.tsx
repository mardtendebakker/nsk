import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { COMPANIES_PATH } from '../../../utils/axios/paths';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../memoizedInput/textField';
import Autocomplete from '../../memoizedInput/autocomplete';
import BaseTextField from '../../input/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';

function Form({
  formRepresentation,
  disabled,
  setValue,
  type,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  setValue: SetValue,
  type: 'customer' | 'supplier'
}) {
  const { trans } = useTranslation();

  return (
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
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              error={Boolean(formRepresentation.name.error)}
              helperText={formRepresentation.name.error}
              label={trans('contactForm.name.label')}
              placeholder={trans('contactForm.name.placeholder')}
              name="name"
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
              value={formRepresentation.name.value || ''}
            />
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              error={Boolean(formRepresentation.kvk_nr.error)}
              helperText={formRepresentation.kvk_nr.error}
              label={trans('contactForm.kvkNr.label')}
              placeholder={trans('contactForm.kvkNr.placeholder')}
              name="kvk_nr"
              onChange={(e) => setValue({ field: 'kvk_nr', value: e.target.value })}
              value={formRepresentation.kvk_nr.value || ''}
            />
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.representative.error)}
              helperText={formRepresentation.representative.error}
              label={trans('contactForm.representative.label')}
              placeholder={trans('contactForm.representative.placeholder')}
              name="representative"
              onChange={(e) => setValue({ field: 'representative', value: e.target.value })}
              value={formRepresentation.representative.value || ''}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              error={Boolean(formRepresentation.email.error)}
              helperText={formRepresentation.email.error}
              label={trans('contactForm.email.label')}
              placeholder={trans('contactForm.email.placeholder')}
              name="email"
              type="email"
              onChange={(e) => setValue({ field: 'email', value: e.target.value })}
              value={formRepresentation.email.value || ''}
            />
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              error={Boolean(formRepresentation.phone.error)}
              helperText={formRepresentation.phone.error}
              label={trans('contactForm.phone.label')}
              placeholder={trans('contactForm.phone.placeholder')}
              name="phone"
              onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
              value={formRepresentation.phone.value || ''}
            />
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.phone2.error)}
              helperText={formRepresentation.phone2.error}
              label={trans('contactForm.phone2.label')}
              placeholder={trans('contactForm.phone2.placeholder')}
              name="phone2"
              onChange={(e) => setValue({ field: 'phone2', value: e.target.value })}
              value={formRepresentation.phone2.value || ''}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
          >
            <Autocomplete
              sx={{ flex: 0.33, mr: '1rem' }}
              multiple
              disabled={disabled}
              options={[]}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('contactForm.list.label')}
                    placeholder={trans('contactForm.list.placeholder')}
                  />
                )
               }
            />
            <Autocomplete
              sx={{ flex: 0.33, mr: '1rem' }}
              disabled={disabled}
              options={[]}
              filterSelectedOptions
              renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('contactForm.tag.label')}
                    placeholder={trans('contactForm.tag.placeholder')}
                  />
                )
               }
            />
            {type == 'supplier' ? (
              <DataSourcePicker
                sx={{ flex: 0.33 }}
                url={COMPANIES_PATH.replace(':id', '')}
                params={{ partnerOnly: '1' }}
                disabled={disabled}
                fullWidth
                label={trans('contactForm.partner.label')}
                placeholder={trans('contactForm.partner.placeholder')}
                onChange={(value: { id: number }) => setValue({ field: 'partner', value: value?.id })}
                value={formRepresentation.partner.value}
              />
            ) : (
              <Box sx={{ flex: 0.33, display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  sx={{ alignSelf: 'end' }}
                  onChange={(_, checked) => setValue({ field: 'is_partner', value: checked })}
                  checked={formRepresentation.is_partner.value as boolean}
                />
                <Typography variant="inherit">
                  {trans('isPartner')}
                </Typography>
              </Box>
            )}
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
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.5, mr: '1rem' }}
              error={Boolean(formRepresentation.street.error)}
              helperText={formRepresentation.street.error}
              label={trans('contactForm.street.label')}
              placeholder={trans('contactForm.street.placeholder')}
              name="street"
              onChange={(e) => setValue({ field: 'street', value: e.target.value })}
              value={formRepresentation.street.value || ''}
            />
            <TextField
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street_extra.error)}
              helperText={formRepresentation.street_extra.error}
              label={trans('contactForm.extraStreet.label')}
              placeholder={trans('contactForm.extraStreet.placeholder')}
              name="street_extra"
              onChange={(e) => setValue({ field: 'street_extra', value: e.target.value })}
              value={formRepresentation.street_extra.value || ''}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.city.error)}
              helperText={formRepresentation.city.error}
              label={trans('contactForm.city.label')}
              placeholder={trans('contactForm.city.placeholder')}
              name="city"
              onChange={(e) => setValue({ field: 'city', value: e.target.value })}
              value={formRepresentation.city.value || ''}
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.zip.error)}
              helperText={formRepresentation.zip.error}
              label={trans('contactForm.zipcode.label')}
              placeholder={trans('contactForm.zipcode.placeholder')}
              name="zip"
              onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
              value={formRepresentation.zip.value || ''}
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.state.error)}
              helperText={formRepresentation.state.error}
              label={trans('contactForm.state.label')}
              placeholder={trans('contactForm.state.placeholder')}
              name="state"
              onChange={(e) => setValue({ field: 'state', value: e.target.value })}
              value={formRepresentation.state.value || ''}
            />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.country.error)}
              helperText={formRepresentation.country.error}
              label={trans('contactForm.country.label')}
              placeholder={trans('contactForm.country.placeholder')}
              name="country"
              onChange={(e) => setValue({ field: 'country', value: e.target.value })}
              value={formRepresentation.country.value || ''}
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
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.5, mr: '1rem' }}
              error={Boolean(formRepresentation.street2.error)}
              helperText={formRepresentation.street2.error}
              label={trans('contactForm.street.label')}
              placeholder={trans('contactForm.street.placeholder')}
              name="street2"
              onChange={(e) => setValue({ field: 'street2', value: e.target.value })}
              value={formRepresentation.street2.value || ''}
            />
            <TextField
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street_extra2.error)}
              helperText={formRepresentation.street_extra2.error}
              label={trans('contactForm.extraStreet.label')}
              placeholder={trans('contactForm.extraStreet.placeholder')}
              name="street_extra2"
              onChange={(e) => setValue({ field: 'street_extra2', value: e.target.value })}
              value={formRepresentation.street_extra2.value || ''}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.city2.error)}
              helperText={formRepresentation.city2.error}
              label={trans('contactForm.city.label')}
              placeholder={trans('contactForm.city.placeholder')}
              name="city2"
              onChange={(e) => setValue({ field: 'city2', value: e.target.value })}
              value={formRepresentation.city2.value || ''}
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.zip2.error)}
              helperText={formRepresentation.zip2.error}
              label={trans('contactForm.zipcode.label')}
              placeholder={trans('contactForm.zipcode.placeholder')}
              name="zip2"
              onChange={(e) => setValue({ field: 'zip2', value: e.target.value })}
              value={formRepresentation.zip2.value || ''}
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              error={Boolean(formRepresentation.state2.error)}
              helperText={formRepresentation.state2.error}
              label={trans('contactForm.state.label')}
              placeholder={trans('contactForm.state.placeholder')}
              name="state2"
              onChange={(e) => setValue({ field: 'state2', value: e.target.value })}
              value={formRepresentation.state2.value || ''}
            />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.country2.error)}
              helperText={formRepresentation.country2.error}
              label={trans('contactForm.country.label')}
              placeholder={trans('contactForm.country.placeholder')}
              name="country2"
              onChange={(e) => setValue({ field: 'country2', value: e.target.value })}
              value={formRepresentation.country2.value || ''}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Form;
