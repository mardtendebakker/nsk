import {
  Box, IconButton, Typography,
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { format } from 'date-fns';

export default function Pagination({
  date,
  onPrevious,
  onNext,
}: {
  date: Date,
  onPrevious: () => void,
  onNext : ()=> void
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        data-testid="previous"
        size="small"
        sx={{ borderRadius: 0, border: '1px solid', mr: '1rem' }}
        onClick={onPrevious}
      >
        <ChevronLeft />
      </IconButton>
      <Typography variant="h4">
        {format(date, 'dd MMMM Y')}
      </Typography>
      <IconButton
        data-testid="next"
        size="small"
        sx={{ borderRadius: 0, border: '1px solid', ml: '1rem' }}
        onClick={onNext}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
