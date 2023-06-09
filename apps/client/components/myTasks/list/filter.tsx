import {
  Box, Checkbox, Select, MenuItem, Typography,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import useTranslation from '../../../hooks/useTranslation';
import BorderedBox from '../../borderedBox';
import MemoizedTextField from '../../memoizedInput/textField';

export default function Filter() {
  const { trans } = useTranslation();

  return (
    <form>
      <BorderedBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: (theme) => theme.palette.grey[40] }} />
          <MemoizedTextField
            name="search"
            placeholder={trans('search')}
            fullWidth
            type="text"
            sx={{
              fieldset: {
                display: 'none',
              },
            }}
          />
          <Select
            defaultValue={0}
            size="small"

          >
            <MenuItem value={0}>{trans('allMyTasks')}</MenuItem>
          </Select>
          <Box sx={(theme) => ({
            m: '1.25rem', width: '1px', height: '2.5rem', background: theme.palette.divider,
          })}
          />
          <Checkbox />
          <Typography variant="body1">
            {trans('hideDoneTasks')}
          </Typography>
        </Box>
      </BorderedBox>
    </form>
  );
}
