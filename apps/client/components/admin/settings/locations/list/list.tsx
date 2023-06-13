import {
  Table, TableBody, TableCell, TableHead, TableRow, Pagination,
} from '@mui/material';
import Edit from '../../../../button/edit';
import { Location } from '../../../../../utils/axios/models/location';
import useTranslation from '../../../../../hooks/useTranslation';

export default function List({
  locations,
  onEdit,
  disabled,
  count,
  onPageChange,
  page,
}: {
  onEdit: (id: number) => void,
  locations: Location[],
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
              {trans('zipcodes')}
            </TableCell>
            <TableCell>
              {trans('actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((location: Location) => (
            <TableRow key={location.id}>
              <TableCell>
                {location.id}
              </TableCell>
              <TableCell>
                {location.name}
              </TableCell>
              <TableCell>
                {location.zipcodes}
              </TableCell>
              <TableCell>
                <Edit onClick={() => onEdit(location.id)} disabled={disabled} />
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
