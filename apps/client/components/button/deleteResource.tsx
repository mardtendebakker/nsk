import { Tooltip } from '@mui/material';
import { ModuleName } from '../../stores/security';
import useTranslation from '../../hooks/useTranslation';
import useSecurity from '../../hooks/useSecurity';
import Delete from './delete';

export default function DeleteResource({
  requiredModule,
  onClick,
  disabled,
}:{ onClick: () => void, requiredModule?: ModuleName, disabled: boolean }) {
  const { trans } = useTranslation();
  const { hasModule } = useSecurity();

  const activeModule = requiredModule ? hasModule(requiredModule) : true;

  return (
    <Tooltip title={!activeModule && trans('inactiveModuleMessage', { vars: (new Map()).set('module', requiredModule) })}>
      <span>
        <Delete onClick={onClick} disabled={disabled || !activeModule} tooltip />
      </span>
    </Tooltip>
  );
}
