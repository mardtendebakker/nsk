import { Box, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { SetValue, FormRepresentation } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import BorderedBox from '../../borderedBox';
import TextField from '../../memoizedInput/textField';
import DataSourcePicker from '../../memoizedInput/dataSourcePicker';
import { LOCATIONS_PATH, PRODUCT_STATUSES_PATH, PRODUCT_TYPES_PATH } from '../../../utils/axios/paths';
import { Attribute, ProductType } from '../../../utils/axios/models/product';
import AutocompleteAttribute from './AutocompleteAttribute';
import FileAttribute from './FileAttribute';

export const buildAttributeKey = (attribute: Attribute, productType: ProductType) => (
  `attribute:${attribute.type}:${productType.id}:${attribute.id}`
);

export default function Form({
  setValue,
  formRepresentation,
  disabled,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation
  disabled?: boolean
}) {
  const { trans } = useTranslation();
  const [productType, setProductType] = useState<ProductType | undefined>();

  const handleAttributeChange = (attribute: Attribute, value: any) => {
    setValue({
      field: buildAttributeKey(attribute, productType),
      value,
    });
  };

  const getAttributeValue = (attribute: Attribute) => (
    formRepresentation[buildAttributeKey(attribute, productType)]?.value
  );

  return (
    <>
      <BorderedBox sx={{ width: '80rem', p: '1rem' }}>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('basicInfo')}
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              label={trans('productForm.sku.label')}
              placeholder={trans('productForm.sku.placeholder')}
              value={formRepresentation.sku.value || ''}
              onChange={(e) => setValue({ field: 'sku', value: e.target.value })}
              disabled={disabled}
            />
            <TextField
              sx={{ flex: 0.33, mr: '1rem' }}
              label={trans('productName')}
              placeholder={trans('productName')}
              value={formRepresentation.name.value || ''}
              helperText={formRepresentation.name.error}
              error={!!formRepresentation.name.error}
              onChange={(e) => setValue({ field: 'name', value: e.target.value })}
              disabled={disabled}
            />
            <DataSourcePicker
              sx={{ flex: 0.33 }}
              url={PRODUCT_TYPES_PATH.replace(':id', '')}
              label={trans('productType')}
              placeholder={trans('selectProductType')}
              onChange={(selected: ProductType | undefined) => {
                setProductType(selected);
                setValue({ field: 'productType', value: selected?.id });
              }}
              value={formRepresentation.productType.value?.toString()}
              disabled={disabled}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flex: 1 }}
          >
            <DataSourcePicker
              sx={{ flex: 0.33, mr: '1rem' }}
              url={LOCATIONS_PATH.replace(':id', '')}
              label={trans('location')}
              placeholder={trans('selectLocation')}
              onChange={(selected: { id: number }) => setValue({ field: 'location', value: selected?.id })}
              value={formRepresentation.location.value?.toString()}
              helperText={formRepresentation.location.error}
              error={!!formRepresentation.location.error}
              disabled={disabled}
            />
            <DataSourcePicker
              sx={{ flex: 0.33, mr: '1rem' }}
              url={PRODUCT_STATUSES_PATH.replace(':id', '')}
              label={trans('status')}
              placeholder={trans('selectStatus')}
              onChange={(selected: { id: number }) => setValue({ field: 'productStatus', value: selected?.id })}
              value={formRepresentation.productStatus.value?.toString()}
              disabled={disabled}
            />
            <TextField
              type="number"
              sx={{ flex: 0.33 }}
              label={trans('price')}
              placeholder="0.00"
              value={formRepresentation.price.value || ''}
              InputProps={{
                startAdornment: (<Box sx={{ mr: '.2rem' }}>€</Box>),
              }}
              onChange={(e) => setValue({ field: 'price', value: e.target.value })}
              disabled={disabled}
            />
          </Grid>
          <Grid
            item
            sx={{ display: 'flex', flex: 1 }}
          >
            <TextField
              fullWidth
              size="medium"
              multiline
              rows={3}
              label={trans('description')}
              name="description"
              value={formRepresentation.description.value || ''}
              onChange={(e) => setValue({ field: 'description', value: e.target.value })}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </BorderedBox>
      {productType?.attributes.length > 0 && (
      <BorderedBox sx={{ width: '80rem', p: '1rem', mt: '1.5rem' }}>
        <Typography
          sx={{ mb: '2rem' }}
          variant="h4"
        >
          {trans('attributes')}
        </Typography>
        <Grid sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {
          productType?.attributes?.map((attribute: Attribute) => {
            if (attribute.type == 1 || attribute.type == 3) {
              return (
                <AutocompleteAttribute
                  key={buildAttributeKey(attribute, productType)}
                  value={getAttributeValue(attribute)}
                  onChange={(option) => { handleAttributeChange(attribute, option?.id); }}
                  attribute={attribute}
                  disabled={disabled}
                />
              );
            } if (attribute.type == 0) {
              return (
                <TextField
                  key={buildAttributeKey(attribute, productType)}
                  sx={{ flex: '0 33%', pr: '1rem' }}
                  label={attribute.name}
                  value={getAttributeValue(attribute) || ''}
                  onChange={(e) => { handleAttributeChange(attribute, e.target.value); }}
                  disabled={disabled}
                />
              );
            } if (attribute.type == 2) {
              return (
                <FileAttribute
                  key={buildAttributeKey(attribute, productType)}
                  attribute={attribute}
                  value={getAttributeValue(attribute) || []}
                  onChange={(value) => handleAttributeChange(attribute, value)}
                  disabled={disabled}
                />
              );
            }

            return undefined;
          })
        }
        </Grid>
      </BorderedBox>
      )}
    </>
  );
}

Form.defaultProps = { disabled: false };
