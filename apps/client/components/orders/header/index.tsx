import Add from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import useTranslation from '../../../hooks/useTranslation';
import {
  ORDERS_PURCHASES, ORDERS_PURCHASES_NEW, ORDERS_REPAIRS, ORDERS_REPAIRS_NEW, ORDERS_SALES, ORDERS_SALES_NEW,
} from '../../../utils/routes';
import HeaderItems from './headerItems';

const NEW_ORDER_PATH = {
  [ORDERS_PURCHASES]: ORDERS_PURCHASES_NEW,
  [ORDERS_SALES]: ORDERS_SALES_NEW,
  [ORDERS_REPAIRS]: ORDERS_REPAIRS_NEW,
};

const NEW_ORDER_LABEL = {
  [ORDERS_PURCHASES]: 'newPurchase',
  [ORDERS_SALES]: 'newSale',
  [ORDERS_REPAIRS]: 'newRepair',
};

export default function Header() {
  const router = useRouter();
  const { trans } = useTranslation();

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <HeaderItems />
      <Button
        sx={{ mb: '.5rem' }}
        size="small"
        variant="contained"
        onClick={() => router.push(NEW_ORDER_PATH[router.pathname] || ORDERS_PURCHASES_NEW)}
      >
        <Add />
        {trans(NEW_ORDER_LABEL[router.pathname])}
      </Button>
    </Box>
  );
}
