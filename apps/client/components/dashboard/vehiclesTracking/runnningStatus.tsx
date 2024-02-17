import { Box } from '@mui/material';
import { Vehicle } from '../../../utils/axios/models/vehicle';
import useTranslation from '../../../hooks/useTranslation';

export default function RunningStatus({ vehicle }:{ vehicle: Vehicle }) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{
        px: '1rem',
        py: '.5rem',
        bgcolor: vehicle.running ? '#00bf0025' : '#a1a7a125',
        color: vehicle.running ? '#00bf00' : '#a1a7a1',
        borderRadius: '.3rem',
        width: 'fit-content',
        fontWeight: (theme) => theme.typography.fontWeightMedium,
      }}
      >
        {vehicle.running ? trans('running') : trans('stopped')}
      </Box>
    </Box>
  );
}
