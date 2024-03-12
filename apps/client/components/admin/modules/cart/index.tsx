import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import useCart from '../../../../hooks/useCart';
import useTranslation from '../../../../hooks/useTranslation';
import ModuleLine from './moduleLine';
import { price } from '../../../../utils/formatter';
import useAxios from '../../../../hooks/useAxios';
import { AxiosResponse, PAYMENTS_SETUP } from '../../../../utils/axios';
import { ADMIN_MODULES_PAYMENTS } from '../../../../utils/routes';

export default function Cart() {
  const { state: { modules }, totalAmount } = useCart();
  const router = useRouter();
  const { call, performing } = useAxios<string>('post', PAYMENTS_SETUP, { withProgressBar: true });

  const { trans } = useTranslation();
  const handlePay = () => {
    call({
      body: {
        modules: modules.map(({ name }) => name),
        redirectUrl: `${window.location.origin + ADMIN_MODULES_PAYMENTS}?clearCart=1`,
      },
    }).then(({ data }: AxiosResponse) => {
      router.push(data);
    });
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: '1rem' }}>
        {trans('cart')}
      </Typography>
      {modules.length > 0
        ? (
          <Box sx={{ width: 'fit-content', mx: 'auto' }}>
            {modules.map((module) => <ModuleLine key={module.name} module={module} />)}
            <Box sx={{ my: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h1">
                {trans('total')}
              </Typography>
              <Typography variant="h1">
                {price(totalAmount())}
              </Typography>
            </Box>
            <Button fullWidth variant="contained" color="primary" disabled={performing} onClick={handlePay}>{trans('pay')}</Button>
          </Box>
        ) : <Typography variant="body1">{trans('emptyCartMessage')}</Typography>}
    </>
  );
}
