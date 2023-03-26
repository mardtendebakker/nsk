import Add from '@mui/icons-material/Add';
import { Box, Button, Typography } from '@mui/material';
import { memo, useState } from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import Select from '../../../memoizedFormInput/select';

function Permission({ id, permission, detail }:
{ id: number, permission: number, detail: number }) {
  const { trans } = useTranslation();

  return (
    <Box sx={{ display: 'flex', mb: '1rem' }}>
      <Select
        options={[]}
        name="permission"
        placeholder={trans('userForm.permission.placeholder')}
        sx={{ flex: 0.75, mr: '1rem' }}
      />
      <Select
        options={[]}
        name="permissionDetail"
        placeholder={trans('userForm.permissionDetail.placeholder')}
        sx={{ flex: 0.25 }}
      />
    </Box>
  );
}

function PermissionsPicker() {
  const { trans } = useTranslation();
  const [permissions, setPermissions] = useState<{
    id: number,
    permission: number,
    detail: number
  }[]>([]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ mb: '1rem' }}>
        {trans('userForm.permissions')}
      </Typography>
      {permissions.map(({ id, permission, detail }) => (
        <Permission
          key={id}
          id={id}
          permission={permission}
          detail={detail}
        />
      ))}
      <Button onClick={() => setPermissions((currentValue) => [
        ...currentValue,
        {
          id: parseInt((Math.random() * 10000).toString(2), 2),
          permission: 0,
          detail: 0,
        }])}
      >
        <Add />
        {trans('addAnother')}
      </Button>
    </Box>
  );
}

export default memo(
  PermissionsPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
