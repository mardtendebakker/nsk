import {
  Table, TableBody, TableCell, TableHead, TableRow, Pagination,
} from '@mui/material';
import Edit from '../../../../button/edit';
import { Attribute } from '../../../../../utils/axios/models/product';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  attributes,
  onEdit,
  disabled,
  count,
  onPageChange,
  page,
}: {
  onEdit: (id: number) => void,
  attributes: Attribute[],
  count: number,
  page: number,
  onPageChange: (newPage: number)=>void,
  disabled: boolean
}) {
  const { trans } = useTranslation();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {trans('id')}
            </TableCell>
            <TableCell>
              {trans('name')}
            </TableCell>
            <TableCell>
              {trans('code')}
            </TableCell>
            <TableCell>
              {trans('type')}
            </TableCell>
            <TableCell>
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attributes.map((attribute: Attribute) => (
            <TableRow key={attribute.id}>
              <TableCell>
                {attribute.id}
              </TableCell>
              <TableCell>
                {attribute.name}
              </TableCell>
              <TableCell>
                {attribute.attr_code}
              </TableCell>
              <TableCell>
                {attribute.type}
              </TableCell>
              <TableCell>
                <Edit onClick={() => onEdit(attribute.id)} disabled={disabled} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'end', mt: '2rem' }}
        shape="rounded"
        count={count}
        onChange={(_, newPage) => onPageChange(newPage)}
        page={page}
      />
    </>
  );
}
