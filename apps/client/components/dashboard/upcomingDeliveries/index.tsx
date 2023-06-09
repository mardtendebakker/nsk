import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import Delivery from './delivery';
import useTranslation from '../../../hooks/useTranslation';

export default function UpcomingDeliveries() {
  const { trans } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {trans('upcomingDeliveries')}
          {' '}
          1
        </Typography>
        <Box sx={{ width: '100%', height: '20rem' }} />
        <Delivery />
      </CardContent>
    </Card>
  );
}
