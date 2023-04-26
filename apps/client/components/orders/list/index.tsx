import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import { PURCHASE_ORDERS_PATH, SALES_ORDERS_PATH, ORDER_STATUSES_PATH } from '../../../utils/axios';
import { ORDERS_PURCHASES } from '../../../utils/routes';
import Filter from '../filter';
import debounce from '../../../utils/debounce';
import Action from './action';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';

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

  ['status', 'search', 'partner', 'createdBy'].forEach((keyword) => {
    if (formRepresentation[keyword].value) {
      const value = formRepresentation[keyword].value.toString();
      params.append(keyword, value);
    }
  });

  const orderBy = {};

  ['orderBy'].forEach((keyword) => {
    if (formRepresentation[keyword].value) {
      const value = formRepresentation[keyword].value.toString();
      const [property, direction = 'desc'] = value.split(':');
      orderBy[property] = direction;
      params.append(keyword, value);
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      status: formRepresentation.status.value,
      search: formRepresentation.search.value,
      partner: formRepresentation.partner.value,
      createdBy: formRepresentation.createdBy.value,
      orderBy: JSON.stringify(orderBy),
    },
  }).then(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

const debouncedRefreshList = debounce(refreshList);

export default function ListContainer() {
  const { trans } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [changeStatusValue, setChangeStatusValue] = useState<number | undefined>();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [checkedOrderIds, setCheckedOrderIds] = useState<number[]>([]);

  const createdAt = parseInt(router.query?.createdAt?.toString(), 10);
  const orderBy = router.query?.orderBy?.toString();
  const status = router.query?.status?.toString();
  const partner = router.query?.partner?.toString();
  const createdBy = router.query?.createdBy?.toString();

  const isPurchasePage = router.pathname == ORDERS_PURCHASES;

  const { formRepresentation, setValue } = useForm({
    search: {
      value: router.query?.search?.toString() || '',
    },
    createdAt: {
      value: Number.isInteger(createdAt) ? createdAt : null,
    },
    orderBy: {
      value: orderBy || undefined,
    },
    status: {
      value: status || undefined,
    },
    partner: {
      value: partner || undefined,
    },
    createdBy: {
      value: createdBy || undefined,
    },
  });

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    (isPurchasePage ? PURCHASE_ORDERS_PATH : SALES_ORDERS_PATH).replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    (isPurchasePage ? PURCHASE_ORDERS_PATH : SALES_ORDERS_PATH).replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callPatch, performing: performingPatch } = useAxios(
    'patch',
    (isPurchasePage ? PURCHASE_ORDERS_PATH : SALES_ORDERS_PATH).replace(':id', ''),
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
  }, [formRepresentation.search.value]);

  useEffect(() => {
    refreshList({
      page,
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
    formRepresentation.status.value?.toString(),
    formRepresentation.partner.value?.toString(),
    formRepresentation.createdBy.value?.toString(),
    formRepresentation.orderBy.value,
  ]);

  const handleAllChecked = (checked: boolean) => {
    setCheckedOrderIds(checked ? data.map(({ id }) => id) : []);
  };

  const handleRowChecked = ({ id, checked }: { id: number, checked: boolean }) => {
    if (checked) {
      setCheckedOrderIds((oldValue) => [...oldValue, id]);
    } else {
      setCheckedOrderIds((oldValue) => oldValue.filter((currentId) => currentId !== id));
    }
  };

  const disabled = (): boolean => performing || performingDelete || performingPatch;

  const handleDelete = () => {
    callDelete({ body: checkedOrderIds })
      .then(() => {
        setCheckedOrderIds([]);
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

  const handlePatchStatus = () => {
    callPatch({ body: checkedOrderIds })
      .then(() => {
        setCheckedOrderIds([]);
        debouncedRefreshList({
          page,
          formRepresentation,
          router,
          call,
        });
      })
      .catch(() => {})
      .finally(() => {
        setShowChangeStatusModal(false);
        setChangeStatusValue(undefined);
      });
  };

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
      <Action
        disabled={disabled()}
        allChecked={checkedOrderIds.length === data.length && data.length > 0}
        checkedProductsCount={checkedOrderIds.length}
        onAllChecked={handleAllChecked}
        onChangeStatus={() => setShowChangeStatusModal(true)}
        onPrint={() => {}}
        onDelete={() => setShowDeleteModal(true)}
      />
      <Box sx={{ m: '1.5rem' }} />
      <List
        orders={data}
        count={Math.floor(count / 10)}
        page={page}
        onChecked={handleRowChecked}
        checkedOrderIds={checkedOrderIds}
        onPageChanged={(newPage) => setPage(newPage)}
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
            {trans('deleteOrderQuestion')}
          </Box>
        )}
        content={<>{trans('deleteOrderContent')}</>}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
        confirmButtonColor="error"
        confirmButtonVariant="outlined"
        confirmButtonText={trans('deleteOrderConfirm')}
      />
      )}
      {showChangeStatusModal && (
      <ConfirmationDialog
        disabled={!changeStatusValue}
        title={<>{trans('changeStatus')}</>}
        content={(
          <Box>
            {trans('changeStatusContent')}
            <Box sx={{ pb: '2rem' }} />
            <DataSourcePicker
              url={ORDER_STATUSES_PATH.replace(':id', '')}
              disabled={disabled()}
              fullWidth
              placeholder={trans('selectStatus')}
              onChange={(value) => setChangeStatusValue(value)}
              value={changeStatusValue}
            />
          </Box>
        )}
        onConfirm={handlePatchStatus}
        onClose={() => setShowChangeStatusModal(false)}
        confirmButtonText={trans('saveChanges')}
      />
      )}
    </Card>
  );
}
