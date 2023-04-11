import { render } from '@testing-library/react';
import { CUSTOMERS_CONTACTS, MY_TASKS } from '../../../utils/routes';
import Header from './index';

const mockRouter = {
  get pathname() { return CUSTOMERS_CONTACTS; },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Header', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should highlight the active menu item', () => {
    const { getByText } = render(<Header />);

    expect(getByText('customers')).toHaveStyle({ fontWeight: 700 });

    expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('suppliers')).toHaveStyle({ fontWeight: 400 });
  });

  it('should highlight myTasks menu item', () => {
    jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue(MY_TASKS);
    const { getByText } = render(<Header />);

    expect(getByText('myTasks')).toHaveStyle({ fontWeight: 700 });

    expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('customers')).toHaveStyle({ fontWeight: 400 });
    expect(getByText('suppliers')).toHaveStyle({ fontWeight: 400 });
  });
});
