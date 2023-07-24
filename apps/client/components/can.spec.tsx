import React from 'react';
import { render } from '@testing-library/react';
import Can from './can';

jest.mock('../hooks/useSecurity', () => () => ({ state: { user: { groups: ['local'] } } }));

describe('Can Component Tests', () => {
  it('should render the children', () => {
    const { getByText } = render(
      <Can requiredGroups={['local', 'admin']}>
        <div>Rendered Content</div>
      </Can>,
    );

    expect(getByText('Rendered Content')).toBeInTheDocument();
  });
  it('should not render the children', () => {
    const { queryByText } = render(
      <Can requiredGroups={['admin']}>
        <div>Rendered Content</div>
      </Can>,
    );

    expect(queryByText(/Rendered Content/i)).toBeNull();
  });
});
