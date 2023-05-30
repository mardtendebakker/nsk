import { Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { STOCK_PRODUCTS_PATH, STOCK_REPAIR_SERVICES_PATH, LOCATIONS_PATH } from '../../../utils/axios';
import List from './list';
import useAxios from '../../../hooks/useAxios';
import { STOCKS_PRODUCTS } from '../../../utils/routes';
import useForm, { FieldPayload } from '../../../hooks/useForm';
import Filter from './filter';
import Action from './action';
import ConfirmationDialog from '../../confirmationDialog';
import useTranslation from '../../../hooks/useTranslation';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import EditModal from '../editModal';

function initFormState(
  {
    search, productType, location, productStatus,
  }:
  {
    search?: string,
    productType?: string,
    location?: string,
    productStatus?: string,
  },
) {
  return {
    search: {
      value: search,
    },
    productType: {
      value: productType || undefined,
    },
    location: {
      value: location || undefined,
    },
    productStatus: {
      value: productStatus || undefined,
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
    'productType',
    'location',
    'productStatus',
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
    const newPath = paramsString ? `${router.pathname}?${params.toString()}` : router.pathname;

    if (newPath != router.asPath) {
      router.replace(newPath);
    }
  });
}

export default function ListContainer() {
  const { trans } = useTranslation();
  const router = useRouter();
  const [showChangeLocationModal, setShowChangeLocationModal] = useState(false);
  const [changeLocationValue, setChangeLocationValue] = useState<number | undefined>();
  const [page, setPage] = useState<number>(parseInt(router.query?.page?.toString() || '1', 10));
  const [editProductId, setEditProductId] = useState<number | undefined>();
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]);

  const ajaxPath = router.pathname == STOCKS_PRODUCTS
    ? STOCK_PRODUCTS_PATH
    : STOCK_REPAIR_SERVICES_PATH;

  const { formRepresentation, setValue, setData } = useForm(initFormState({
    search: router.query?.search?.toString(),
    productType: router.query?.productType?.toString(),
    location: router.query?.location?.toString(),
    productStatus: router.query?.productStatus?.toString(),
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
    formRepresentation.productType.value?.toString(),
    formRepresentation.productStatus.value?.toString(),
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
      <Action
        disabled={disabled()}
        allChecked={checkedProductIds.length === data.length && data.length > 0}
        checkedProductsCount={checkedProductIds.length}
        onAllCheck={handleAllChecked}
        onEdit={() => setEditProductId(checkedProductIds[0])}
        onChangeLocation={() => setShowChangeLocationModal(true)}
        onPrint={() => {}}
        onDelete={handleDelete}
      />
      <Box sx={{ m: '1rem' }} />
      <List
        products={data}
        count={Math.ceil(count / 10)}
        page={page}
        onCheck={handleRowChecked}
        checkedProductIds={checkedProductIds}
        onPageChange={(newPage) => { setPage(newPage); setCheckedProductIds([]); }}
      />
      {editProductId && (
        <EditModal
          onClose={() => setEditProductId(undefined)}
          onSubmit={() => setEditProductId(undefined)}
          id={editProductId.toString()}
          type={router.pathname == STOCKS_PRODUCTS ? 'product' : 'repair'}
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
