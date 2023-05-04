import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Delete from '@mui/icons-material/Delete';
import { STOCK_PRODUCTS_PATH, LOCATIONS_PATH } from '../../../../utils/axios';
import List from './list';
import useAxios from '../../../../hooks/useAxios';
import { STOCKS_PRODUCTS } from '../../../../utils/routes';
import useForm, { FieldPayload } from '../../../../hooks/useForm';
import Filter from './filter';
import Action from '../../action';
import Edit from '../edit';
import ConfirmationDialog from '../../../confirmationDialog';
import useTranslation from '../../../../hooks/useTranslation';
import DataSourcePicker from '../../../memoizedInput/dataSourcePicker';

function initFormState(
  {
    search, availability, productType, location, taskStatus, assignedTo,
  }:
  {
    search?: string,
    availability?: string,
    productType?: string,
    location?: string,
    taskStatus?: string,
    assignedTo?: string
  },
) {
  return {
    search: {
      value: search || '',
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
      value: taskStatus || undefined,
    },
    assignedTo: {
      value: assignedTo || undefined,
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

  [
    'search',
    'availability',
    'productType',
    'location',
    'taskStatus',
    'assignedTo',
  ].forEach((filter) => {
    if (formRepresentation[filter].value || formRepresentation[filter].value === 0) {
      const value = formRepresentation[filter].value.toString();
      params.append(filter, value);
      paramsToSend[filter] = formRepresentation[filter].value;
    }
  });

  call({
    params: {
      take: 10,
      skip: (page - 1) * 10,
      ...paramsToSend,
    },
  }).finally(() => {
    const paramsString = params.toString();
    const newPath = paramsString ? `${STOCKS_PRODUCTS}?${params.toString()}` : STOCKS_PRODUCTS;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [changeLocationValue, setChangeLocationValue] = useState<number | undefined>();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    availability: router.query?.availability?.toString(),
    productType: router.query?.productType?.toString(),
    location: router.query?.location?.toString(),
    taskStatus: router.query?.taskStatus?.toString(),
    assignedTo: router.query?.assignedTo?.toString(),
  }));

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
      showSuccessMessage: true,
    },
  );

  const { call: callPatch, performing: performingPatch } = useAxios(
    'patch',
    STOCK_PRODUCTS_PATH.replace(':id', ''),
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

  const disabled = (): boolean => performing || performingDelete || performingPatch;

  const handlePatchLocation = () => {
    callPatch({ body: { ids: checkedProductIds, product: { location_id: changeLocationValue } } })
      .then(() => {
        setCheckedProductIds([]);
        refreshList({
          page,
          formRepresentation,
          router,
          call,
        });
      })
      .catch(() => {})
      .finally(() => {
        setShowChangeLocationModal(false);
        setChangeLocationValue(undefined);
      });
  };

  const handleReset = () => {
    setData(initFormState({}));
    setPage(1);
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
      <Edit onClose={() => setEditProductId(undefined)} open={!!editProductId} />
      <Action
        disabled={disabled()}
        allChecked={checkedProductIds.length === data.length && data.length > 0}
        checkedProductsCount={checkedProductIds.length}
        onAllChecked={handleAllChecked}
        onEdit={() => setEditProductId(checkedProductIds[0])}
        onChangeLocation={() => setShowChangeLocationModal(true)}
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
      {showChangeLocationModal && (
      <ConfirmationDialog
        disabled={!changeLocationValue}
        title={<>{trans('changeLocation')}</>}
        content={(
          <Box>
            {trans('changeLocationContent')}
            <Box sx={{ pb: '2rem' }} />
            <DataSourcePicker
              url={LOCATIONS_PATH.replace(':id', '')}
              disabled={disabled()}
              fullWidth
              placeholder={trans('selectLocation')}
              onChange={(value: { id: number }) => setChangeLocationValue(value?.id)}
              value={changeLocationValue?.toString()}
            />
          </Box>
        )}
        onConfirm={handlePatchLocation}
        onClose={() => setShowChangeLocationModal(false)}
        confirmButtonText={trans('saveChanges')}
      />
      )}
    </Card>
  );
}
