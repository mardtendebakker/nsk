import BaseTableCell, { TableCellProps } from '@mui/material/TableCell';

export default function TableCell({ children, ...rest }: TableCellProps) {
  return (
    <BaseTableCell {...rest}>
      {children || '--'}
    </BaseTableCell>
  );
}
