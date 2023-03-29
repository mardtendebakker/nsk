import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import List from './list';
import useTranslation from '../../../../../hooks/useTranslation';

export default function ListContainer() {
  const { trans } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '2rem' }}>
        <Typography variant="h3">
          {trans('productTasks')}
          {' (0)'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {}}
        >
          <Add />
          {trans('newProductTask')}
        </Button>
      </Box>
      <List />
    </Box>
  );
}
