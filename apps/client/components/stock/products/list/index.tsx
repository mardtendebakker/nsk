import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Delete from '@mui/icons-material/Delete';
import { STOCK_PRODUCTS_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_PRODUCTS } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';
import Action from '../../action';
import Edit from '../edit';
import debounce from '../../../../utils/debounce';
import ConfirmationDialog from '../../../confirmationDialog';
import useTranslation from '../../../../hooks/useTranslation';

function refreshList({
  page,
  formRepresentation,
  router,
  call,
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', page.toString());
  }

  [
    'search',
    'availability',
    'productType',
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
      availability: formRepresentation.availability.value,
      productType: formRepresentation.productType.value,
      location: formRepresentation.location.value,
      search: formRepresentation.search.value,
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_PRODUCTS}?${params.toString()}` : STOCKS_PRODUCTS;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);
  const availability = router.query?.availability?.toString();
  const productType = router.query?.productType?.toString();
  const location = router.query?.location?.toString();
  const taskStatus = router.query?.taskStatus?.toString();
  const assignedTo = router.query?.assignedTo?.toString();

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    availability: {
      value: availability || undefined,
    },
    productType: {
      value: productType || undefined,
    },
    location: {
      value: location || undefined,
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

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
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
  }, [
    page,
    formRepresentation.search.value,
    formRepresentation.availability.value?.toString(),
    formRepresentation.productType.value?.toString(),
    formRepresentation.location.value?.toString(),
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

  const handleDelete = () => {
    callDelete({ body: checkedProductIds })
      .then(() => {
        setCheckedProductIds([]);
        debouncedRefreshList({
          page,
          formRepresentation,
          router,
          call,
        });
      })
      .catch(() => {})
      .finally(() => {
        setShowDeleteModal(false);
      });
  };

  const disabled = (): boolean => performing || performingDelete;

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        disabled={disabled()}
        formRepresentation={formRepresentation}
        setValue={(payload: FieldPayload) => {
          setValue(payload);
          setPage(1);
        }}
      />
      <Box sx={{ m: '1.5rem' }} />
      <Edit onClose={() => setEditProductId(undefined)} open={!!editProductId} />
      <Action
        disabled={disabled()}
        allChecked={checkedProductIds.length === data.length && data.length > 0}
        checkedProductsCount={checkedProductIds.length}
        onAllChecked={handleAllChecked}
        onEdit={() => setEditProductId(checkedProductIds[0])}
        onChangeLocation={() => {}}
        onChangeAvailability={() => {}}
        onAssign={() => {}}
        onPrint={() => {}}
        onDelete={() => setShowDeleteModal(true)}
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
      {showDeleteModal && (
      <ConfirmationDialog
        title={(
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Delete
              color="error"
              sx={{
                mb: '1rem',
                padding: '.5rem',
                fontSize: '2.5rem',
                borderRadius: '50%',
                bgcolor: (theme) => theme.palette.error.light,
              }}
            />
            {trans('deleteResourceQuestion')}
          </Box>
        )}
        content={<>{trans('deleteResourceContent')}</>}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
        confirmButtonColor="error"
        confirmButtonVariant="outlined"
        confirmButtonText={trans('deleteConfirm')}
      />
      )}
    </Card>
  );
}
