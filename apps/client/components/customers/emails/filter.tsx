import { Box, TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import MemoizedTextField from '../../memoizedFormInput/TextField';
import Autocomplete from '../../memoizedFormInput/Autocomplete';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';

export default function Filter({
  disabled,
  formRepresentation,
  setValue,
}: {
  disabled: boolean,
  formRepresentation : FormRepresentation,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form>
      <Box sx={(theme) => ({
        border: `1px solid ${theme.palette.grey[30]}`,
        borderRadius: '0.5rem',
        p: '.1rem 1.5rem',
      })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: '#7F8FA4' }} />
          <MemoizedTextField
            disabled={disabled}
            name="search"
            label={trans('search')}
            fullWidth
            value={formRepresentation.search.value}
            onChange={(e) => setValue({ field: 'search', value: e.target.value })}
            type="text"
            sx={{
              fieldset: {
                display: 'none',
              },
            }}
          />
          <DesktopDatePicker
            disabled={disabled}
            label={trans('createdAt')}
            inputFormat="YYYY/MM/DD"
            value={formRepresentation.createdAt.value}
            onChange={(value) => setValue({ field: 'createdAt', value: moment(value).format('YYYY/MM/DD') })}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
              />
            )}
          />
          <Box sx={(theme) => ({
            m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.grey[30],
          })}
          />
          <Autocomplete
            disabled={disabled}
            sx={{ width: '13.75rem' }}
            size="small"
            options={[]}
            /*
            onChange={
            (_, option) => setValue({
               field: 'status', value: option?.id === undefined ? null : option.id }
               )}
           */
            value={[].find(({ id }) => id === formRepresentation.status.value) || null}
            // isOptionEqualToValue={(option, value) => option.id === value?.id}
            filterSelectedOptions
            renderInput={
                (params) => <TextField {...params} label={trans('status')} sx={{ width: '13.75rem' }} />
            }
          />
        </Box>
      </Box>
    </form>
  );
}
