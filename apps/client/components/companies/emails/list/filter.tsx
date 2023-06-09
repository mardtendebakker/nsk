import { Box } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import MemoizedTextField from '../../../memoizedInput/textField';
import Autocomplete from '../../../memoizedInput/autocomplete';
import useTranslation from '../../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../../hooks/useForm';
import TextField from '../../../input/textField';
import BorderedBox from '../../../borderedBox';

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
      <BorderedBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: (theme) => theme.palette.grey[40] }} />
          <MemoizedTextField
            disabled={disabled}
            name="search"
            placeholder={trans('search')}
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
            inputFormat="YYYY/MM/DD"
            value={formRepresentation.createdAt.value}
            onChange={(value) => setValue({ field: 'createdAt', value: moment(value.toString()).format('YYYY/MM/DD') })}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                inputProps={{
                  placeholder: trans('createdAt'),
                }}
              />
            )}
          />
          <Box sx={(theme) => ({
            m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
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
                (params) => <TextField {...params} placeholder={trans('status')} sx={{ width: '13.75rem' }} />
            }
          />
        </Box>
      </BorderedBox>
    </form>
  );
}
