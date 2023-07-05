import ChevronRight from '@mui/icons-material/ChevronRight';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import useTranslation from '../../../hooks/useTranslation';

export default function List({ title }: { title: string }) {
  const { trans } = useTranslation();
  const [expanded, setExpanded] = useState(true);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary sx={{ background: 'transparent !important' }}>
        <ChevronRight sx={{ transform: `rotate(${expanded ? '90deg' : '0deg'})` }} />
        <Typography variant="h5">
          {title}
          {' / 2 '}
          {trans('tasks').toLowerCase()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {trans('taskName')}
              </TableCell>
              <TableCell>
                {trans('productName/type')}
              </TableCell>
              <TableCell>
                {trans('orderNumber')}
              </TableCell>
              <TableCell>
                {trans('dueBy')}
              </TableCell>
              <TableCell>
                {trans('taskStatus')}
              </TableCell>
              <TableCell>
                {trans('assignedTo')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
        </Table>
      </AccordionDetails>
    </Accordion>
  );
}
