import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import { price } from '../../utils/formatter';

function Indicator({ title, value }: { title: string, value: string }) {
  return (
    <Box sx={{ mx: '.5rem' }}>
      <Typography variant="inherit" color="text.secondary">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}

export default function IndicatorRow() {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {
        [
          { title: 'Test Test 1', value: price(100) },
          { title: 'Test Test 2', value: price(100) },
          { title: 'Test Test 3', value: price(100) },
          { title: 'Test Test 4', value: price(100) },
          { title: 'Test Test 5', value: price(100) },
        ]
          .map(({ title, value }) => <Indicator key={title} title={title} value={value} />)
        }
      </CardContent>
    </Card>
  );
}
