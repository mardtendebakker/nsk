import React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';

import Form from '.';

const mockSetValue = jest.fn();

const mockFormRepresentation = {
  name: {
    value: 'Test Sub-Type',
    error: null,
  },
  product_type_id: {
    value: 1,
    error: null,
  },
  magento_category_id: {
    value: '123',
    error: null,
  },
  magento_attr_set_id: {
    value: '456',
    error: null,
  },
  pindex: {
    value: 1,
    error: null,
  },
};

const defaultProps = {
  setValue: mockSetValue,
  formRepresentation: mockFormRepresentation,
  disabled: false,
};

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Form {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders all form fields', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    expect(getByLabelText('productSubTypeForm.name.label')).toBeInTheDocument();
    expect(getByLabelText('productSubTypeForm.productType.label')).toBeInTheDocument();
    expect(getByLabelText('productSubTypeForm.magentoCategoryId.label')).toBeInTheDocument();
    expect(getByLabelText('productSubTypeForm.magentoAttrSetId.label')).toBeInTheDocument();
    expect(getByLabelText('productSubTypeForm.pindex.label')).toBeInTheDocument();
  });

  it('displays current values', () => {
    const { getByDisplayValue } = render(<Form {...defaultProps} />);

    expect(getByDisplayValue('Test Sub-Type')).toBeInTheDocument();
    expect(getByDisplayValue('123')).toBeInTheDocument();
    expect(getByDisplayValue('456')).toBeInTheDocument();
    expect(getByDisplayValue('1')).toBeInTheDocument();
  });

  it('calls setValue when name field changes', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    const nameField = getByLabelText('productSubTypeForm.name.label');
    fireEvent.change(nameField, { target: { value: 'New Name' } });

    expect(mockSetValue).toHaveBeenCalledWith({
      field: 'name',
      value: 'New Name',
    });
  });

  it('calls setValue when magento category id field changes', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    const categoryField = getByLabelText('productSubTypeForm.magentoCategoryId.label');
    fireEvent.change(categoryField, { target: { value: '999' } });

    expect(mockSetValue).toHaveBeenCalledWith({
      field: 'magento_category_id',
      value: '999',
    });
  });

  it('calls setValue when magento attr set id field changes', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    const attrSetField = getByLabelText('productSubTypeForm.magentoAttrSetId.label');
    fireEvent.change(attrSetField, { target: { value: '888' } });

    expect(mockSetValue).toHaveBeenCalledWith({
      field: 'magento_attr_set_id',
      value: '888',
    });
  });

  it('calls setValue when pindex field changes', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    const pindexField = getByLabelText('productSubTypeForm.pindex.label');
    fireEvent.change(pindexField, { target: { value: '5' } });

    expect(mockSetValue).toHaveBeenCalledWith({
      field: 'pindex',
      value: 5,
    });
  });

  it('handles empty pindex value', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    const pindexField = getByLabelText('productSubTypeForm.pindex.label');
    fireEvent.change(pindexField, { target: { value: '' } });

    expect(mockSetValue).toHaveBeenCalledWith({
      field: 'pindex',
      value: null,
    });
  });

  it('disables all fields when disabled prop is true', () => {
    const { getByLabelText } = render(<Form {...defaultProps} disabled />);

    expect(getByLabelText('productSubTypeForm.name.label')).toBeDisabled();
    expect(getByLabelText('productSubTypeForm.magentoCategoryId.label')).toBeDisabled();
    expect(getByLabelText('productSubTypeForm.magentoAttrSetId.label')).toBeDisabled();
    expect(getByLabelText('productSubTypeForm.pindex.label')).toBeDisabled();
  });

  it('enables all fields when disabled prop is false', () => {
    const { getByLabelText } = render(<Form {...defaultProps} disabled={false} />);

    expect(getByLabelText('productSubTypeForm.name.label')).not.toBeDisabled();
    expect(getByLabelText('productSubTypeForm.magentoCategoryId.label')).not.toBeDisabled();
    expect(getByLabelText('productSubTypeForm.magentoAttrSetId.label')).not.toBeDisabled();
    expect(getByLabelText('productSubTypeForm.pindex.label')).not.toBeDisabled();
  });

  it('displays error messages', () => {
    const formRepresentationWithErrors = {
      ...mockFormRepresentation,
      name: {
        value: 'Test Sub-Type',
        error: 'Name is required',
      },
      product_type_id: {
        value: 1,
        error: 'Product type is required',
      },
    };

    const { getByText } = render(
      <Form {...defaultProps} formRepresentation={formRepresentationWithErrors} />,
    );

    expect(getByText('Name is required')).toBeInTheDocument();
    expect(getByText('Product type is required')).toBeInTheDocument();
  });

  it('handles null values', () => {
    const formRepresentationWithNulls = {
      name: { value: null, error: null },
      product_type_id: { value: null, error: null },
      magento_category_id: { value: null, error: null },
      magento_attr_set_id: { value: null, error: null },
      pindex: { value: null, error: null },
    };

    const { getByLabelText } = render(
      <Form {...defaultProps} formRepresentation={formRepresentationWithNulls} />,
    );

    expect(getByLabelText('productSubTypeForm.name.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.magentoCategoryId.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.magentoAttrSetId.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.pindex.label')).toHaveValue('');
  });

  it('handles undefined values', () => {
    const formRepresentationWithUndefined = {
      name: { value: undefined, error: null },
      product_type_id: { value: undefined, error: null },
      magento_category_id: { value: undefined, error: null },
      magento_attr_set_id: { value: undefined, error: null },
      pindex: { value: undefined, error: null },
    };

    const { getByLabelText } = render(
      <Form {...defaultProps} formRepresentation={formRepresentationWithUndefined} />,
    );

    expect(getByLabelText('productSubTypeForm.name.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.magentoCategoryId.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.magentoAttrSetId.label')).toHaveValue('');
    expect(getByLabelText('productSubTypeForm.pindex.label')).toHaveValue('');
  });

  it('renders DataSourcePicker for product type', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    // The DataSourcePicker should be rendered for product type selection
    expect(getByLabelText('productSubTypeForm.productType.label')).toBeInTheDocument();
  });

  it('handles product type selection', () => {
    const { getByLabelText } = render(<Form {...defaultProps} />);

    // This would be tested by mocking the DataSourcePicker component
    // For now, we can verify the component renders without errors
    expect(getByLabelText('productSubTypeForm.productType.label')).toBeInTheDocument();
  });
});
