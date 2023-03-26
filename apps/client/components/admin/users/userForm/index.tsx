import { Grid, Typography } from '@mui/material';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import useTranslation from '../../../../hooks/useTranslation';
import BorderedBox from '../../../borderedBox';
import TextField from '../../../memoizedFormInput/textField';
import UserRolePicker from '../../../memoizedFormInput/userRolePicker';
import UserStatusPicker from '../../../memoizedFormInput/userStatusPicker';
import PermissionsPicker from './permissionsPicker';

export default function UserForm({
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
            sx={{ display: 'flex', flex: 1, alignItems: 'center' }}
          >
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              label={trans('userForm.username.label')}
              placeholder={trans('userForm.username.placeholder')}
              name="username"
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              label={trans('userForm.firstName.label')}
              placeholder={trans('userForm.firstName.placeholder')}
              name="firstName"
            />
            <TextField
              sx={{ flex: 0.25, mr: '1rem' }}
              label={trans('userForm.lastName.label')}
              placeholder={trans('userForm.lastName.placeholder')}
              name="lastName"
            />
            <UserStatusPicker sx={{ flex: 0.25 }} />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.66, mr: '1rem' }}
              label={trans('userForm.email.label')}
              placeholder={trans('userForm.email.placeholder')}
              name="email"
              type="email"
            />
            <UserRolePicker sx={{ flex: 0.34 }} />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <PermissionsPicker />
          </Grid>
        </Grid>
      </BorderedBox>
    </form>
  );
}
