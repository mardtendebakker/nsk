import { Box } from '@mui/material';
import Search from '@mui/icons-material/Search';
import { format } from 'date-fns';
import MemoizedTextField from '../../memoizedInput/textField';
import Autocomplete from '../../memoizedInput/autocomplete';
import useTranslation from '../../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import TextField from '../../input/textField';
import BorderedBox from '../../borderedBox';
import DatePicker from '../../input/datePicker';

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
    <BorderedBox>
      <Box sx={{
        display: 'flex', alignItems: 'center', px: '1rem', py: '.6rem',
      }}
      >
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
        <DatePicker
          disabled={disabled}
          value={formRepresentation.createdAt.value}
          onChange={(value) => {
            if (!value) {
              setValue({ field: 'createdAt', value });
            } else {
              setValue({ field: 'createdAt', value: format(new Date(value.toString()), 'yyyy/MM/dd') });
            }
          }}
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
          width: '1px', height: '2.5rem', mx: '.5rem', background: theme.palette.divider,
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
  );
}
