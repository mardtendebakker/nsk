import BaseTableCell, { TableCellProps as BaseTableCellProps } from '@mui/material/TableCell';

interface TableCellProps extends BaseTableCellProps {
  withPlaceHolder?: boolean
}

export default function TableCell({ children, withPlaceHolder = true, ...rest }: TableCellProps) {
  return (
    <BaseTableCell {...rest}>
      {withPlaceHolder && (children || '--')}
    </BaseTableCell>
  );
}
