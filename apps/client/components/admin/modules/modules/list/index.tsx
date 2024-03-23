import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import useAxios from '../../../../../hooks/useAxios';
import { PAYMENTS_FREE_TRIAL_PATH, MODULES_PATH, MODULES_CONFIGS_PATH } from '../../../../../utils/axios';
import List from './list';
import { ModuleListItem } from '../../../../../utils/axios/models/module';
import useTranslation from '../../../../../hooks/useTranslation';
import SettingsModal from './settingsModal';

export default function ListContainer() {
  const { trans } = useTranslation();
  const [moduleToConfig, setModuleToConfig] = useState<ModuleListItem | undefined>();
  const { data = [], call, performing } = useAxios<ModuleListItem[] | undefined>(
    'get',
    MODULES_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callFreeTrial, performing: performingFreeTrial } = useAxios<ModuleListItem[] | undefined>(
    'patch',
    PAYMENTS_FREE_TRIAL_PATH.replace(':moduleName', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callPutConfig, performing: performingPutConfig } = useAxios<ModuleListItem[] | undefined>(
    'put',
    MODULES_CONFIGS_PATH.replace(':moduleName', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    call();
  }, []);

  const handleFreeTrial = async (module: ModuleListItem) => {
    await callFreeTrial({ path: PAYMENTS_FREE_TRIAL_PATH.replace(':id', module.id.toString()) });
    call();
  };

  const handleSettingsSubmit = async (body) => {
    await callPutConfig({ path: MODULES_CONFIGS_PATH.replace(':id', moduleToConfig.id.toString()), body });
    setModuleToConfig(undefined);
    call();
  };

  const disabled = performing || performingFreeTrial || performingPutConfig;

  return (
    <>
      {moduleToConfig && <SettingsModal module={moduleToConfig} onSubmit={handleSettingsSubmit} onClose={() => setModuleToConfig(undefined)} disabled={disabled} />}
      <Typography variant="h4" sx={{ mb: '1rem' }}>
        {trans('modules')}
      </Typography>
      <List modules={data} onFreeTrial={handleFreeTrial} onSettings={setModuleToConfig} disabled={disabled} />
    </>
  );
}
