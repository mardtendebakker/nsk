import {
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import { format } from 'date-fns';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Settings from '@mui/icons-material/Settings';
import { ModuleListItem } from '../../../../../utils/axios/models/module';
import useTranslation from '../../../../../hooks/useTranslation';
import TableCell from '../../../../tableCell';
import { price } from '../../../../../utils/formatter';
import useCart from '../../../../../hooks/useCart';

export default function List({
  modules = [], disabled, onFreeTrial, onSettings,
}: { modules: ModuleListItem[], disabled: boolean, onFreeTrial: (module: ModuleListItem) => void, onSettings: (module: ModuleListItem) => void }) {
  const { trans } = useTranslation();
  const { addModule, state: { modules: modulesCart } } = useCart();

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            {trans('name')}
          </TableCell>
          <TableCell>
            {trans('price')}
          </TableCell>
          <TableCell>
            {trans('activeAt')}
          </TableCell>
          <TableCell>
            {trans('expiresAt')}
          </TableCell>
          <TableCell>
            {trans('active')}
          </TableCell>
          <TableCell>
            {trans('actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {modules.map((module: ModuleListItem) => {
          const canAddToCart = !modulesCart.find(({ name }) => module.name == name) && !module.active;
          const missingConfig = module.config && !!Object.values(module.config).find((config) => config.required && config.value === null);

          return (
            <TableRow
              sx={{
                height: 60,
              }}
              hover
              key={module.name}
            >
              <TableCell>
                {module.name}
              </TableCell>
              <TableCell>
                {price(module.price)}
              </TableCell>
              <TableCell>
                {module.activeAt && format(new Date(module.activeAt), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell>
                {module.expiresAt && format(new Date(module.expiresAt), 'yyyy/MM/dd')}
              </TableCell>
              <TableCell>
                {module.active ? <Check /> : '--'}
              </TableCell>
              <TableCell>
                <Tooltip title={trans('addToCart')}>
                  <span>
                    <IconButton
                      disabled={!canAddToCart || missingConfig || disabled}
                      onClick={() => canAddToCart && !missingConfig && addModule({
                        id: module.id,
                        name: module.name,
                        price: module.price,
                      })}
                    >
                      <AddShoppingCart />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={trans('startFreeTrial')}>
                  <span>
                    <IconButton
                      disabled={!canAddToCart || module.freeTrialUsed || missingConfig || disabled}
                      onClick={() => canAddToCart && !module.freeTrialUsed && !missingConfig && onFreeTrial(module)}
                    >
                      <PlayArrow />
                    </IconButton>
                  </span>
                </Tooltip>
                {module.config && (
                <Tooltip title={trans('settings')}>
                  <span>
                    <IconButton
                      disabled={disabled}
                      onClick={() => onSettings(module)}
                    >
                      <Settings />
                    </IconButton>
                  </span>
                </Tooltip>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
