import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { AUTOCOMPLETE_PARTNERS_PATH } from '../../utils/axios';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedInput/textField';
import DataSourcePicker from '../memoizedInput/dataSourcePicker';
import Checkbox from '../checkbox';
import useResponsive from '../../hooks/useResponsive';
import Can from '../can';

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
  const isDesktop = useResponsive('up', 'md');

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
          spacing={1}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.name.error)}
              helperText={formRepresentation.name.error}
              label={trans('contactForm.name.label')}
              placeholder={trans('contactForm.name.placeholder')}
              name="name"
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
              value={formRepresentation.name.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.company_name.error)}
              helperText={formRepresentation.company_name.error}
              label={trans('contactForm.company_name.label')}
              placeholder={trans('contactForm.company_name.placeholder')}
              name="company_name"
              onChange={(e) => setValue({ field: 'company_name', value: e.target.value })}
              value={formRepresentation.company_name.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.company_kvk_nr.error)}
              helperText={formRepresentation.company_kvk_nr.error}
              label={trans('contactForm.company_kvk_nr.label')}
              placeholder={trans('contactForm.company_kvk_nr.placeholder')}
              name="company_kvk_nr"
              onChange={(e) => setValue({ field: 'company_kvk_nr', value: e.target.value })}
              value={formRepresentation.company_kvk_nr.value || ''}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.email.error)}
              helperText={formRepresentation.email.error}
              label={trans('contactForm.email.label')}
              placeholder={trans('contactForm.email.placeholder')}
              name="email"
              type="email"
              onChange={(e) => setValue({ field: 'email', value: e.target.value })}
              value={formRepresentation.email.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.33 }}
              error={Boolean(formRepresentation.phone.error)}
              helperText={formRepresentation.phone.error}
              label={trans('contactForm.phone.label')}
              placeholder={trans('contactForm.phone.placeholder')}
              name="phone"
              onChange={(e) => setValue({ field: 'phone', value: e.target.value })}
              value={formRepresentation.phone.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
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
          <Can requiredGroups={['admin', 'super_admin', 'manager', 'logistics', 'local']}>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
            >
              {type == 'supplier' ? (
                <DataSourcePicker
                  sx={{ flex: isDesktop ? 0.33 : 1 }}
                  path={AUTOCOMPLETE_PARTNERS_PATH}
                  disabled={disabled}
                  fullWidth
                  label={trans('partner')}
                  placeholder={trans('selectPartner')}
                  onChange={(value: { id: number }) => setValue({ field: 'partner', value: value?.id || null })}
                  value={formRepresentation.partner.value}
                />
              ) : (
                <Box sx={{ flex: isDesktop ? 0.33 : 1 }}>
                  <Checkbox
                    checked={formRepresentation.is_partner.value}
                    onCheck={(checked) => setValue({ field: 'is_partner', value: checked })}
                    label={trans('isPartner')}
                  />
                  {!formRepresentation.is_partner.value && (
                  <DataSourcePicker
                    label={trans('partner')}
                    path={AUTOCOMPLETE_PARTNERS_PATH}
                    disabled={disabled}
                    fullWidth
                    placeholder={trans('selectPartner')}
                    value={formRepresentation.partner.value}
                    onChange={(value: { id: number }) => setValue({ field: 'partner', value: value?.id || null })}
                  />
                  )}
                </Box>
              )}
            </Grid>
          </Can>
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
          spacing={1}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street.error)}
              helperText={formRepresentation.street.error}
              label={trans('contactForm.street.label')}
              placeholder={trans('contactForm.street.placeholder')}
              name="street"
              onChange={(e) => setValue({ field: 'street', value: e.target.value })}
              value={formRepresentation.street.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
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
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.city.error)}
              helperText={formRepresentation.city.error}
              label={trans('contactForm.city.label')}
              placeholder={trans('contactForm.city.placeholder')}
              name="city"
              onChange={(e) => setValue({ field: 'city', value: e.target.value })}
              value={formRepresentation.city.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.zip.error)}
              helperText={formRepresentation.zip.error}
              label={trans('contactForm.zipcode.label')}
              placeholder={trans('contactForm.zipcode.placeholder')}
              name="zip"
              onChange={(e) => setValue({ field: 'zip', value: e.target.value })}
              value={formRepresentation.zip.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.state.error)}
              helperText={formRepresentation.state.error}
              label={trans('contactForm.state.label')}
              placeholder={trans('contactForm.state.placeholder')}
              name="state"
              onChange={(e) => setValue({ field: 'state', value: e.target.value })}
              value={formRepresentation.state.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
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
          spacing={1}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.5 }}
              error={Boolean(formRepresentation.street2.error)}
              helperText={formRepresentation.street2.error}
              label={trans('contactForm.street.label')}
              placeholder={trans('contactForm.street.placeholder')}
              name="street2"
              onChange={(e) => setValue({ field: 'street2', value: e.target.value })}
              value={formRepresentation.street2.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
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
            sx={{ display: 'flex', flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}
          >
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.city2.error)}
              helperText={formRepresentation.city2.error}
              label={trans('contactForm.city.label')}
              placeholder={trans('contactForm.city.placeholder')}
              name="city2"
              onChange={(e) => setValue({ field: 'city2', value: e.target.value })}
              value={formRepresentation.city2.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.zip2.error)}
              helperText={formRepresentation.zip2.error}
              label={trans('contactForm.zipcode.label')}
              placeholder={trans('contactForm.zipcode.placeholder')}
              name="zip2"
              onChange={(e) => setValue({ field: 'zip2', value: e.target.value })}
              value={formRepresentation.zip2.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
            <TextField
              sx={{ flex: 0.25 }}
              error={Boolean(formRepresentation.state2.error)}
              helperText={formRepresentation.state2.error}
              label={trans('contactForm.state.label')}
              placeholder={trans('contactForm.state.placeholder')}
              name="state2"
              onChange={(e) => setValue({ field: 'state2', value: e.target.value })}
              value={formRepresentation.state2.value || ''}
            />
            <Box sx={{ m: '.25rem' }} />
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
