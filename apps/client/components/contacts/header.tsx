import {
  Box, Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { CONTACTS_NEW } from '../../utils/routes';
import NewResource from '../button/newResource';

export default function Header({ newContactRoute = CONTACTS_NEW }:{ newContactRoute ?: string }) {
  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('contacts')}</Typography>
      </Box>
      <NewResource onClick={() => router.push(newContactRoute)} requiredModule="customer_contact_action" label={trans('newContact')} />
    </Box>
  );
}
