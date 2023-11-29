import { render } from '@testing-library/react';
import Menu from './menu';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '' }),
}));

describe('menu', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Menu />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders menu items', () => {
    const { getByText } = render(<Menu />);

    expect(getByText('locations')).not.toBeNull();
    expect(getByText('productTypes')).not.toBeNull();
    expect(getByText('attributes')).not.toBeNull();
    expect(getByText('tasks')).not.toBeNull();
    expect(getByText('productStatuses')).not.toBeNull();
    expect(getByText('orderStatuses')).not.toBeNull();
  });
});
