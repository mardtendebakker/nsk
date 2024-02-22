import {
  Box, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { COMPANIES_NEW } from '../../utils/routes';
import NewResource from '../button/newResource';

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('companies')}</Typography>
      </Box>
      <NewResource onClick={() => router.push(COMPANIES_NEW)} requiredModule="customer_contact_action" label={trans('newCompany')} />
    </Box>

  );
}
