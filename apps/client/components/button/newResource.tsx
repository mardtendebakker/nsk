import { Button, Tooltip } from '@mui/material';
import Add from '@mui/icons-material/Add';
import useTranslation from '../../hooks/useTranslation';
import useSecurity from '../../hooks/useSecurity';
import { ModuleName } from '../../stores/security';

export default function NewResource({
  requiredModule,
  onClick,
  disabled = false,
  label,
}:{ onClick: () => void, requiredModule: ModuleName, disabled?: boolean, label: string }) {
  const { trans } = useTranslation();
  const { hasModule } = useSecurity();

  const activeModule = true;

  return (
    <Tooltip title={!activeModule && trans('inactiveModuleMessage', { vars: (new Map()).set('module', requiredModule) })}>
      <span>
        <Button
          size="small"
          disabled={disabled || !activeModule}
          variant="contained"
          onClick={onClick}
        >
          <Add />
          {trans(label)}
        </Button>
      </span>
    </Tooltip>
  );
}
