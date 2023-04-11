import {
  Box, Card, CardContent, Typography,
} from '@mui/material';

function Indicator({ title, value }: { title: string, value: string }) {
  return (
    <Box>
      <Typography variant="inherit" color="text.secondary">{title}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}

export default function IndicatorRow() {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {
        [
          { title: 'Test Test 1', value: '€100.00' },
          { title: 'Test Test 2', value: '€100.00' },
          { title: 'Test Test 3', value: '€100.00' },
          { title: 'Test Test 4', value: '€100.00' },
          { title: 'Test Test 5', value: '€100.00' },
        ]
          .map(({ title, value }) => <Indicator key={title} title={title} value={value} />)
        }
      </CardContent>
    </Card>
  );
}
