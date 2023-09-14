import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { FormRepresentation, SetValue } from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import { Attribute, AttributeOption } from '../../../utils/axios/models/product';
import BorderedBox from '../../borderedBox';
import AutocompleteAttribute from './AutocompleteAttribute';
import FileAttribute from './FileAttribute';
import { AFile } from '../../../utils/axios/models/aFile';
import useAxios from '../../../hooks/useAxios';
import { PRODUCT_TYPES_PATH } from '../../../utils/axios';
import TextField from '../../memoizedInput/textField';

export const buildProductTypeKey = (productType: { id?: number }): string => `attribute:${productType.id}`;

export const buildAttributeKey = (attribute: { id?: number }, productType: { id?: number }): string => (
  `${buildProductTypeKey(productType)}:${attribute.id}`
);

export default function AttributeForm({
  setValue,
  formRepresentation,
  productTypeId,
  disabled,
}: {
  setValue: SetValue,
  formRepresentation: FormRepresentation,
  productTypeId,
  disabled?: boolean
}) {
  const { trans } = useTranslation();
  const { data: productTypeRelation, call } = useAxios('get', PRODUCT_TYPES_PATH.replace(':id', productTypeId));
  useEffect(() => {
    call();
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
    <BorderedBox sx={{ width: '80rem', p: '1rem', mt: '1.5rem' }}>
      <Typography
        sx={{ mb: '2rem' }}
        variant="h4"
      >
        {trans('attributes')}
      </Typography>
      <Grid sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
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
                  sx={{ flex: '0 33%', pr: '.5rem' }}
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

AttributeForm.defaultProps = { disabled: false };
