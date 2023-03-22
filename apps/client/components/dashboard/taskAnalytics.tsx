import {
  Box, Button, Card, CardContent, IconButton, MenuItem, Select, Typography,
} from '@mui/material';
import FileDownload from '@mui/icons-material/FileDownload';
import useTranslation from '../../hooks/useTranslation';

export default function TaskAnalytics() {
  const { trans } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {trans('taskAnalytics')}
          </Typography>
          <Box>
            <Select defaultValue={0} size="small">
              <MenuItem value={0}>{trans('thisMonth')}</MenuItem>
            </Select>
            <IconButton sx={(theme) => ({
              p: '.65rem',
              ml: '1rem',
              borderRadius: '.5rem',
              border: `1px solid ${theme.palette.divider}`,
            })}
            >
              <FileDownload />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: '2rem' }}>
          <Button variant="outlined" color="inherit" sx={{ mr: '1rem' }}>
            {trans('sales')}
          </Button>
          <Button variant="outlined" color="inherit" sx={{ mr: '1rem' }}>
            {trans('purchases')}
          </Button>
          <Button variant="outlined" color="inherit" sx={{ mr: '1rem' }}>
            {trans('repairs')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
