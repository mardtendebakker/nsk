import { Box, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { Module } from '../../../../stores/cart';
import useTranslation from '../../../../hooks/useTranslation';
import { price } from '../../../../utils/formatter';
import useCart from '../../../../hooks/useCart';
import ConfirmationDialog from '../../../confirmationDialog';

export default function ModuleLine({ module }:{ module: Module }) {
  const { trans } = useTranslation();
  const [showRemoveModuleConfirmation, setShowRemoveModuleConfirmation] = useState(false);
  const { removeModule } = useCart();

  return (
    <Box sx={{ width: '20rem', m: 'auto' }}>
      <ConfirmationDialog
        open={showRemoveModuleConfirmation}
        title={<>{trans('removeModule')}</>}
        content={<span>{`${trans('removeModuleConfirmation')}`}</span>}
        onConfirm={() => removeModule(module)}
        onClose={() => setShowRemoveModuleConfirmation(false)}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h2">
          {module.name}
        </Typography>
        <Typography variant="body1">
          {price(module.price)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => setShowRemoveModuleConfirmation(true)} color="error">
          {trans('remove')}
        </Typography>
      </Box>
      <Divider sx={{ my: '.5rem' }} />
    </Box>
  );
}
