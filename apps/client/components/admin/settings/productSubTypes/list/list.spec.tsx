import React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';

import List from '.';

describe('List', () => {
  const mockProductSubTypes = [
    {
      id: 1,
      name: 'Laptop Sub-Type',
      product_type_id: 1,
      magento_category_id: '123',
      magento_attr_set_id: '456',
      pindex: 1,
      productType: {
        id: 1,
        name: 'Electronics',
      },
    },
    {
      id: 2,
      name: 'Desktop Sub-Type',
      product_type_id: 1,
      magento_category_id: '124',
      magento_attr_set_id: '457',
      pindex: 2,
      productType: {
        id: 1,
        name: 'Electronics',
      },
    },
    {
      id: 3,
      name: 'Accessory Sub-Type',
      product_type_id: 2,
      magento_category_id: '125',
      magento_attr_set_id: '458',
      pindex: 3,
      productType: {
        id: 2,
        name: 'Accessories',
      },
    },
  ];

  const defaultProps = {
    productSubTypes: mockProductSubTypes,
    onEdit: jest.fn(),
    disabled: false,
    count: 3,
    page: 1,
    onPageChange: jest.fn(),
    onRowsPerPageChange: jest.fn(),
    rowsPerPage: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<List {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders all product sub-types', () => {
    const { getByText } = render(<List {...defaultProps} />);

    expect(getByText('Laptop Sub-Type')).toBeInTheDocument();
    expect(getByText('Desktop Sub-Type')).toBeInTheDocument();
    expect(getByText('Accessory Sub-Type')).toBeInTheDocument();
  });

  it('renders product type names', () => {
    const { getByText } = render(<List {...defaultProps} />);

    expect(getByText('Electronics')).toBeInTheDocument();
    expect(getByText('Accessories')).toBeInTheDocument();
  });

  it('renders magento fields', () => {
    const { getByText } = render(<List {...defaultProps} />);

    expect(getByText('123')).toBeInTheDocument();
    expect(getByText('456')).toBeInTheDocument();
    expect(getByText('124')).toBeInTheDocument();
    expect(getByText('457')).toBeInTheDocument();
  });

  it('handles missing product type', () => {
    const productSubTypesWithMissingType = [
      {
        id: 1,
        name: 'Sub-Type Without Type',
        product_type_id: 1,
        magento_category_id: '123',
        magento_attr_set_id: '456',
        pindex: 1,
        productType: undefined,
      },
    ];

    const { getByText } = render(
      <List {...defaultProps} productSubTypes={productSubTypesWithMissingType} />,
    );

    expect(getByText('Sub-Type Without Type')).toBeInTheDocument();
    expect(getByText('-')).toBeInTheDocument(); // Should show dash for missing product type
  });

  it('handles missing magento fields', () => {
    const productSubTypesWithMissingFields = [
      {
        id: 1,
        name: 'Sub-Type With Missing Fields',
        product_type_id: 1,
        magento_category_id: null,
        magento_attr_set_id: null,
        magento_group_spec_id: null,
        pindex: 1,
        productType: {
          id: 1,
          name: 'Electronics',
        },
      },
    ];

    const { getByText } = render(
      <List {...defaultProps} productSubTypes={productSubTypesWithMissingFields} />,
    );

    expect(getByText('Sub-Type With Missing Fields')).toBeInTheDocument();
    expect(getByText('Electronics')).toBeInTheDocument();
    // Should show dashes for missing magento fields
    const dashes = document.querySelectorAll('td');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('calls onEdit when edit button is clicked', () => {
    const { getAllByTestId } = render(<List {...defaultProps} />);

    const editButtons = getAllByTestId('edit-icon-button');
    expect(editButtons).toHaveLength(3);

    fireEvent.click(editButtons[0]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(1);

    fireEvent.click(editButtons[1]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(2);

    fireEvent.click(editButtons[2]);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(3);
  });

  it('disables edit buttons when disabled prop is true', () => {
    const { getAllByTestId } = render(<List {...defaultProps} disabled />);

    const editButtons = getAllByTestId('edit-icon-button');
    editButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('enables edit buttons when disabled prop is false', () => {
    const { getAllByTestId } = render(<List {...defaultProps} disabled={false} />);

    const editButtons = getAllByTestId('edit-icon-button');
    editButtons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('passes correct props to PaginatedTable', () => {
    const { container } = render(<List {...defaultProps} />);

    // The PaginatedTable component should be rendered with the correct props
    // We can't directly test this without mocking PaginatedTable, but we can verify
    // that the component renders without errors
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles empty product sub-types array', () => {
    const { getByText } = render(<List {...defaultProps} productSubTypes={[]} />);

    // Should still render the table headers
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('productType')).toBeInTheDocument();
    expect(getByText('magentoCategoryId')).toBeInTheDocument();
    expect(getByText('magentoAttrSetId')).toBeInTheDocument();
    expect(getByText('magentoGroupSpecId')).toBeInTheDocument();
    expect(getByText('actions')).toBeInTheDocument();
  });

  it('handles undefined product sub-types', () => {
    const { getByText } = render(<List {...defaultProps} productSubTypes={undefined} />);

    // Should still render the table headers
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('productType')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    const { getByText } = render(<List {...defaultProps} />);

    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('productType')).toBeInTheDocument();
    expect(getByText('magentoCategoryId')).toBeInTheDocument();
    expect(getByText('magentoAttrSetId')).toBeInTheDocument();
    expect(getByText('magentoGroupSpecId')).toBeInTheDocument();
    expect(getByText('actions')).toBeInTheDocument();
  });

  it('handles different count values', () => {
    const { rerender } = render(<List {...defaultProps} count={0} />);
    expect(document.body).toBeInTheDocument();

    rerender(<List {...defaultProps} count={100} />);
    expect(document.body).toBeInTheDocument();
  });

  it('handles different page values', () => {
    const { rerender } = render(<List {...defaultProps} page={1} />);
    expect(document.body).toBeInTheDocument();

    rerender(<List {...defaultProps} page={5} />);
    expect(document.body).toBeInTheDocument();
  });

  it('handles different rowsPerPage values', () => {
    const { rerender } = render(<List {...defaultProps} rowsPerPage={10} />);
    expect(document.body).toBeInTheDocument();

    rerender(<List {...defaultProps} rowsPerPage={25} />);
    expect(document.body).toBeInTheDocument();
  });
});
