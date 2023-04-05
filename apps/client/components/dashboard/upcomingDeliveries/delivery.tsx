import { Typography, Box, LinearProgress } from '@mui/material';
import Status from './status';
import useTranslation from '../../../hooks/useTranslation';

export default function Delivery() {
  const { trans } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {'test test 12345 '}
          1
        </Typography>
        <Status status="0" />
      </Box>
      <LinearProgress
        variant="determinate"
        color="inherit"
        value={0}
        sx={{ height: '.5rem', borderRadius: '.5rem', mt: '2rem' }}
      />
      <Box sx={{ mt: '2rem' }}>
        <ul style={{ listStyleType: 'none' }}>
          {[{ id: 1 }, { id: 2 }, { id: 3 }].map(({ id }, i) => (
            <li key={id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={(theme) => ({
                  mr: '1rem',
                  border: `.2rem solid ${theme.palette.grey[50]}`,
                  borderRadius: '50%',
                  width: '1rem',
                  height: '1rem',
                })}
                />
                <Typography variant="body1">
                  Test test
                </Typography>
                <Typography variant="body1" sx={{ mr: 0, ml: 'auto' }}>
                  0:00 pm
                </Typography>
              </Box>
              {i !== 2 && (
              <Box sx={(theme) => ({
                height: '3rem',
                width: '.2rem',
                ml: '.3rem',
                borderRight: `.2rem dashed ${theme.palette.divider}`,
              })}
              />
              )}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
