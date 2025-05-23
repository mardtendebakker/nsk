import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { Attribute, AttributeOption, ProductType } from '../../../utils/axios/models/product';
import BorderedBox from '../../borderedBox';
import AutocompleteAttribute from './AutocompleteAttribute';
import FileAttribute from './FileAttribute';
import { AFile } from '../../../utils/axios/models/aFile';
import useAxios from '../../../hooks/useAxios';
import { PRODUCT_TYPES_PATH } from '../../../utils/axios';
import TextField from '../../memoizedInput/textField';
import useResponsive from '../../../hooks/useResponsive';

export const buildProductTypeKey = (productType: { id?: number }): string => `attribute:${productType.id}`;

export const buildAttributeKey = (attribute: { id?: number }, productType: { id?: number }): string => (
  `${buildProductTypeKey(productType)}:${attribute.id}`
);

export default function AttributeForm({
  setValue,
  formRepresentation,
  productTypeId,
  disabled = false,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation,
  productTypeId,
  disabled?: boolean
}) {
  const { trans } = useTranslation();
  const isDesktop = useResponsive('up', 'md');
  const { data: productTypeRelation, call } = useAxios<undefined | ProductType>('get', PRODUCT_TYPES_PATH.replace(':id', productTypeId));
  useEffect(() => {
    call().catch(() => {});
  }, [productTypeId]);

  const handleAttributeChange = (attribute: Attribute, value: any) => {
    setValue({
      field: buildAttributeKey(attribute, productTypeRelation),
      value,
    });
  };

  const handleAttributeOptionChange = (attribute: Attribute, option: AttributeOption) => {
    setValue({
      field: buildAttributeKey(attribute, productTypeRelation),
      value: option.id,
      additionalData: {
        selectedOption: option,
      },
    });
  };

  const getAttributeValue = (attribute: Attribute) => (
    formRepresentation[buildAttributeKey(attribute, productTypeRelation)]?.value
  );

  return (
    <BorderedBox sx={{ p: '1rem', mt: '1.5rem' }}>
      <Typography
        sx={{ mb: '2rem' }}
        variant="h4"
      >
        {trans('attributes')}
      </Typography>
      <Grid sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: isDesktop ? 'flex-start' : undefined,
        flexDirection: isDesktop ? undefined : 'column',
      }}
      >
        {
          productTypeRelation?.attributes?.map((attribute: Attribute) => {
            if (attribute.type == 1 || attribute.type == 3) {
              return (
                <AutocompleteAttribute
                  key={buildAttributeKey(attribute, productTypeRelation)}
                  value={getAttributeValue(attribute)}
                  onChange={(option) => { handleAttributeOptionChange(attribute, option); }}
                  attribute={attribute}
                  disabled={disabled}
                />
              );
            } if (attribute.type == 0) {
              return (
                <TextField
                  key={buildAttributeKey(attribute, productTypeRelation)}
                  sx={{ m: '.5rem', flex: '0 30%' }}
                  label={attribute.name}
                  value={getAttributeValue(attribute) || ''}
                  onChange={(e) => { handleAttributeChange(attribute, e.target.value); }}
                  disabled={disabled}
                />
              );
            } if (attribute.type == 2) {
              return (
                <FileAttribute
                  key={buildAttributeKey(attribute, productTypeRelation)}
                  attribute={attribute}
                  afile={(formRepresentation.afile.value || []) as AFile[]}
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
  );
}
