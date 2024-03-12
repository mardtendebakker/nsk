import { Tooltip } from '@mui/material';
import { ModuleName } from '../../stores/security';
import useTranslation from '../../hooks/useTranslation';
import useSecurity from '../../hooks/useSecurity';
import Edit from './edit';

export default function EditResource({
  requiredModule,
  onClick,
  disabled,
  href,
}:{ onClick?: () => void, requiredModule: ModuleName, disabled?: boolean, href?: string }) {
  const { trans } = useTranslation();
  const { hasModule } = useSecurity();

  const activeModule = hasModule(requiredModule);

  return (
    <Tooltip title={!activeModule && trans('inactiveModuleMessage', { vars: (new Map()).set('module', requiredModule) })}>
      <span>
        <Edit onClick={onClick} disabled={disabled || !activeModule} href={href} />
      </span>
    </Tooltip>
  );
}

EditResource.defaultProps = {
  disabled: false, onClick: undefined, href: undefined,
};
