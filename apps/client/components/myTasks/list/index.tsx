import { Box, Card } from '@mui/material';
import Edit from '../edit';
import Filter from './filter';
import List from './list';

export default function ListContainer() {
  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter />
      <Edit open={false} onClose={() => {}} />
      <Box sx={{ m: '1rem' }} />
      <List title="Title example" />
      <List title="Title example" />
      <List title="Title example" />
    </Card>
  );
}
