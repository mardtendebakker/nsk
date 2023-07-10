import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { BULK_EMAIL_NEW } from '../../utils/routes';

export default function Navigation() {
  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mr: '.5rem' }}>{trans('bulkEmail')}</Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={() => router.push(BULK_EMAIL_NEW)}
      >
        <Add />
        {trans('newEmail')}
      </Button>
    </Box>
  );
}
