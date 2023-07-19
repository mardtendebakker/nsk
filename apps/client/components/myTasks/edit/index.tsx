import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useTranslation from '../../../hooks/useTranslation';
import Autocomplete from '../../memoizedInput/autocomplete';
import TextField from '../../memoizedInput/textField';
import BaseTextField from '../../input/textField';

export default function Edit({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { trans } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <DialogTitle>
        <Box sx={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          {trans('checkForDamagesAndCleanDevices')}
          <IconButton>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', width: '100rem' }}>
        <Box sx={(theme) => ({
          flex: 0.3,
          mr: '1rem',
          border: `1px solid ${theme.palette.divider}`,
          p: '1rem',
          borderRadius: '.5rem',
          height: 'fit-content',
        })}
        >
          <Typography variant="h4">{trans('tasKInfo')}</Typography>
          <Autocomplete
            sx={{ mt: '2rem' }}
            options={[]}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('taskName')}
                  />
                )
               }

          />
          <TextField
            sx={{ mt: '3rem' }}
            fullWidth
            label={trans('productName')}
          />
          <Autocomplete
            sx={{ mt: '3rem' }}
            options={[]}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('productType')}
                  />
                )
               }

          />
          <Autocomplete
            sx={{ mt: '3rem' }}
            options={[]}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('orderNumber')}
                  />
                )
               }

          />
          <DesktopDatePicker
            onChange={() => {}}
            value={null}
            label={trans('dueBy')}
            inputFormat="yyyy/MM/dd"
            renderInput={(params) => (
              <TextField
                sx={{ mt: '3rem' }}
                fullWidth
                size="small"
                {...params}
              />
            )}
          />
          <Autocomplete
            sx={{ mt: '3rem' }}
            options={[]}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('taskStatus')}
                  />
                )
               }

          />
          <Autocomplete
            sx={{ mt: '3rem' }}
            options={[]}
            filterSelectedOptions
            renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('assignedTo')}
                  />
                )
               }

          />
        </Box>
        <Box sx={(theme) => ({ flex: 0.7, bgcolor: theme.palette.grey[10] })} />
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onClose} variant="outlined" color="inherit">{trans('cancel')}</Button>
        <Button size="small" onClick={onClose} variant="contained" color="primary">{trans('save')}</Button>
      </DialogActions>
    </Dialog>
  );
}
