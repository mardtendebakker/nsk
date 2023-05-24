import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import saveBlob from '../../../utils/saveBlob';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import {
  PURCHASE_ORDERS_PATH,
  SALES_ORDERS_PATH,
  ORDER_STATUSES_PATH,
  BULK_PRINT_PURCHASES_PATH,
  BULK_PRINT_SALES_PATH,
  AxiosResponse,
} from '../../../utils/axios';
import {
  ORDERS_PURCHASES, ORDERS_PURCHASES_EDIT, ORDERS_SALES_EDIT,
} from '../../../utils/routes';
import Filter from './filter';
import Action from './action';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';

function initFormState(
  {
    search, createdAt, orderBy, status, partner, createdBy,
  }:
  {
    search?: string,
    createdAt?: string,
    orderBy?: string,
    status?: string,
    partner?: string,
    createdBy?:string
  },
) {
  return {
    search: {
      value: search || '',
    },
    createdAt: {
      value: createdAt || null,
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
  };
}

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

  const paramsToSend = {};

  ['status', 'search', 'partner', 'createdBy'].forEach((filter) => {
    if (formRepresentation[filter].value) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
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
      ...paramsToSend,
      orderBy: JSON.stringify(orderBy),
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

export default function ListContainer() {
  const { trans } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [changeStatusValue, setChangeStatusValue] = useState<number | undefined>();
  const router = useRouter();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [checkedOrderIds, setCheckedOrderIds] = useState<number[]>([]);

  const ajaxPath = router.pathname == ORDERS_PURCHASES ? PURCHASE_ORDERS_PATH : SALES_ORDERS_PATH;
  const ajaxBulkPrintPath = router.pathname == ORDERS_PURCHASES ? BULK_PRINT_PURCHASES_PATH : BULK_PRINT_SALES_PATH;

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    createdAt: router.query?.createdAt?.toString(),
    orderBy: router.query?.orderBy?.toString(),
    status: router.query?.status?.toString(),
    partner: router.query?.partner?.toString(),
    createdBy: router.query?.createdBy?.toString(),
  }));

  const { data: { data = [], count = 0 } = {}, call, performing } = useAxios(
    'get',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
    },
  );

  const { call: callDelete, performing: performingDelete } = useAxios(
    'delete',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  const { call: callPrint, performing: performingPrint } = useAxios(
    'get',
    ajaxBulkPrintPath,
    { withProgressBar: true },
  );

  const { call: callPatch, performing: performingPatch } = useAxios(
    'patch',
    ajaxPath.replace(':id', ''),
    {
      withProgressBar: true,
      showSuccessMessage: true,
    },
  );

  useEffect(() => {
    refreshList({
      page,
      formRepresentation,
      router,
      call,
    });
  }, [
    page,
    formRepresentation.search.value,
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

  const disabled = (): boolean => performing || performingDelete || performingPatch || performingPrint;

  const handleDelete = () => {
    callDelete({ body: checkedOrderIds })
      .then(() => {
        setCheckedOrderIds([]);
        refreshList({
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
    callPatch({ body: { ids: checkedOrderIds, order: { status_id: changeStatusValue } } })
      .then(() => {
        setCheckedOrderIds([]);
        refreshList({
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

  const handleReset = () => {
    setPage(1);
    setData(initFormState({}));
  };

  const handlePrint = () => {
    callPrint({ params: { ids: checkedOrderIds }, responseType: 'blob' })
      .then((response: AxiosResponse) => {
        saveBlob(response.data, 'orders.pdf');
      });
  };

  return (
    <Card sx={{ overflowX: 'auto', p: '1.5rem' }}>
      <Filter
        onReset={handleReset}
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
        checkedOrdersCount={checkedOrderIds.length}
        onEdit={() => router.push(
          (router.pathname == ORDERS_PURCHASES ? ORDERS_PURCHASES_EDIT : ORDERS_SALES_EDIT).replace(':id', checkedOrderIds[0].toString()),
        )}
        onAllCheck={handleAllChecked}
        onChangeStatus={() => setShowChangeStatusModal(true)}
        onPrint={handlePrint}
        onDelete={() => setShowDeleteModal(true)}
      />
      <Box sx={{ m: '1.5rem' }} />
      <List
        disabled={disabled()}
        orders={data}
        count={Math.ceil(count / 10)}
        page={page}
        onCheck={handleRowChecked}
        checkedOrderIds={checkedOrderIds}
        onPageChange={(newPage) => setPage(newPage)}
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
              onChange={(value: { id: number }) => setChangeStatusValue(value?.id)}
              value={changeStatusValue?.toString()}
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
