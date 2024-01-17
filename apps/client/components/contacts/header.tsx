import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../hooks/useTranslation';
import { CONTACTS_NEW } from '../../utils/routes';

export default function Header({ newContactRoute }:{ newContactRoute ?: string }) {
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
      <Button
        sx={{ mb: '.5rem' }}
        size="small"
        variant="contained"
        onClick={
        () => router.push(newContactRoute)
        }
      >
        <Add />
        {trans('newContact')}
      </Button>
    </Box>

  );
}

Header.defaultProps = {
  newContactRoute: CONTACTS_NEW,
};
