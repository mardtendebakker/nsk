import { useEffect } from 'react';
import { Typography } from '@mui/material';
import useAxios from '../../../../../hooks/useAxios';
import { PAYMENTS_FREE_TRIAL_PATH, MODULES_PATH } from '../../../../../utils/axios';
import List from './list';
import { ModuleListItem } from '../../../../../utils/axios/models/module';
import useTranslation from '../../../../../hooks/useTranslation';

export default function ListContainer() {
  const { trans } = useTranslation();
  const { data = [], call } = useAxios<ModuleListItem[] | undefined>(
    'get',
    MODULES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callFreeTrial } = useAxios<ModuleListItem[] | undefined>(
    'patch',
    PAYMENTS_FREE_TRIAL_PATH.replace(':moduleName', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    call();
  }, []);

  const handleFreeTrial = async (module: ModuleListItem) => {
    await callFreeTrial({ path: PAYMENTS_FREE_TRIAL_PATH.replace(':moduleName', module.name) });
    call();
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: '1rem' }}>
        {trans('modules')}
      </Typography>
      <List modules={data} onFreeTrial={handleFreeTrial} />
    </>
  );
}
