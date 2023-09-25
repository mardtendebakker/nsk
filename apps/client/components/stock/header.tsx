import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import useResponsive from '../../hooks/useResponsive';
import { STOCKS_PRODUCTS, STOCKS_REPAIR_SERVICES } from '../../utils/routes';
import CreateModal from './createModal';
import HeaderItem from '../list/headerItem';

export default function Header({ onProductCreated }: { onProductCreated: () => void }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');

  const ITEMS = [
    {
      active: router.pathname === STOCKS_PRODUCTS,
      text: trans('products'),
      href: STOCKS_PRODUCTS,
    },
    {
      active: router.pathname === STOCKS_REPAIR_SERVICES,
      text: trans('repairServices'),
      href: STOCKS_REPAIR_SERVICES,
    },
  ];

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
    }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mr: '.5rem', mb: '.5rem' }}>{trans('stock')}</Typography>
        {isDesktop && ITEMS.map(({ text, href, active }) => (
          <HeaderItem text={text} active={active} href={href} key={text} />
        ))}
      </Box>
      {showForm && (
      <CreateModal
        onSubmit={() => {
          onProductCreated();
          setShowForm(false);
        }}
        onClose={() => setShowForm(false)}
      />
      )}
    </Box>
  );
}
