import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { STOCK_PRODUCTS_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_PRODUCTS } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';
import Action from './action';
import Edit from '../edit';

function refreshList({
  page,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();
  const where : { [key: string]: object; } = {};

  if (page > 1) {
    params.append('page', page.toString());
  }

  if (formRepresentation.search.value) {
    const search = formRepresentation.search.value.toString();
    where.name = { contains: search };
    params.append('search', search);
  }

  [
    'availability',
    'type',
    'location',
    'taskStatus',
    'assignedTo',
  ].forEach((keyword) => {
    if (formRepresentation[keyword].value || formRepresentation[keyword].value === 0) {
      const value = formRepresentation[keyword].value.toString();
      params.append(keyword, value);
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      where: JSON.stringify(where),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_PRODUCTS}?${params.toString()}` : STOCKS_PRODUCTS;

    if (newPath !== router.pathname) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = _.debounce(refreshList, 500);

export default function ListContainer() {
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const availability = parseInt(router.query?.availability?.toString(), 10);
  const type = parseInt(router.query?.type?.toString(), 10);
  const location = parseInt(router.query?.location?.toString(), 10);
  const taskStatus = parseInt(router.query?.taskStatus?.toString(), 10);
  const assignedTo = parseInt(router.query?.assignedTo?.toString(), 10);

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    availability: {
      value: Number.isInteger(availability) ? availability : null,
    },
    type: {
      value: Number.isInteger(type) ? type : null,
    },
    location: {
      value: Number.isInteger(location) ? location : null,
    },
    taskStatus: {
      value: Number.isInteger(taskStatus) ? taskStatus : null,
    },
    assignedTo: {
      value: Number.isInteger(assignedTo) ? assignedTo : null,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    STOCK_PRODUCTS_PATH.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  useEffect(() => {
    debouncedRefreshList({
      page,
      formRepresentation,
      router,
      call,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.availability.value,
    formRepresentation.type.value,
  ]);

  const handleAllChecked = (checked: boolean) => {
    setCheckedProductIds(checked ? data.map(({ id }) => id) : []);
  };

  const handleRowChecked = ({ id, checked }: { id: number, checked: boolean }) => {
    if (checked) {
      setCheckedProductIds((oldValue) => [...oldValue, id]);
    } else {
      setCheckedProductIds((oldValue) => oldValue.filter((currentId) => currentId !== id));
    }
  };

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        disabled={performing}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '1.5rem' }} />
      <Edit onClose={() => setEditProductId(undefined)} open={!!editProductId} />
      <Action
        disabled={performing}
        allChecked={checkedProductIds.length === data.length && data.length > 0}
        checkedProductsCount={checkedProductIds.length}
        onAllChecked={handleAllChecked}
        onEdit={() => setEditProductId(checkedProductIds[0])}
        onChangeLocation={() => {}}
        onChangeAvailability={() => {}}
        onAssign={() => {}}
        onPrint={() => {}}
        onDelete={() => {}}

      />
      <Box sx={{ m: '1rem' }} />
      <List
        stockProducts={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={handleRowChecked}
        checkedProductIds={checkedProductIds}
        onPageChanged={(newPage) => { setPage(newPage); setCheckedProductIds([]); }}
      />
    </Card>
  );
}
