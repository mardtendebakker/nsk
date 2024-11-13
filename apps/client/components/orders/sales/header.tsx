import Add from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { ORDERS_SALES_NEW } from '../../../utils/routes';
import HeaderItems from '../header/headerItems';
import ImportSalesModal from './importSalesModal';
import Can from '../../can';

export default function Header() {
  const [showImport, setShowImport] = useState(false);

  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <HeaderItems />
      <Box>
        <Can requiredGroups={['admin', 'manager', 'partner_sale_uploader']}>
          <Button
            sx={{ mb: '.5rem', mr: '.5rem' }}
            size="small"
            variant="contained"
            onClick={() => setShowImport(true)}
          >
            <Add />
            {trans('importSales')}
          </Button>
        </Can>
        <Can requiredGroups={['admin', 'manager', 'logistics', 'local']}>
          <Button
            sx={{ mb: '.5rem' }}
            size="small"
            variant="contained"
            onClick={() => router.push(ORDERS_SALES_NEW)}
          >
            <Add />
            {trans('newSales')}
          </Button>
        </Can>
      </Box>
      <ImportSalesModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onConfirm={() => setShowImport(false)}
      />
    </Box>
  );
}
