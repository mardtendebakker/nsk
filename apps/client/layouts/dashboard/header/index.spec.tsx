import { fireEvent, render } from '@testing-library/react';
import { BULK_EMAIL, CONTACTS, MY_TASKS } from '../../../utils/routes';
import Header from './index';

const mockRouter = {
  get pathname() { return CONTACTS; },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../../../hooks/useResponsive', () => jest.fn(() => true));

const mockUseSecurity = {
  signOut: jest.fn(() => Promise.resolve()),
  state: { get user() { return { groups: ['super_admin'] }; } },
};

jest.mock('../../../hooks/useSecurity', () => jest.fn(() => mockUseSecurity));

describe('Header', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
  describe('Horizontal menu items', () => {
    it('should highlight the active menu item', () => {
      const { getByText } = render(<Header />);

      expect(getByText('contacts')).toHaveStyle({ fontWeight: 700 });

      expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('companies')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('bulkEmail')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('logistics')).toHaveStyle({ fontWeight: 400 });
    });

    it('should highlight myTasks menu item', () => {
      jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue(MY_TASKS);
      const { getByText } = render(<Header />);

      expect(getByText('myTasks')).toHaveStyle({ fontWeight: 700 });

      expect(getByText('contacts')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('companies')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('bulkEmail')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('logistics')).toHaveStyle({ fontWeight: 400 });
    });
  });

  describe('Side nav menu', () => {
    it('should open menu', () => {
      jest.requireMock('../../../hooks/useResponsive').mockReturnValue(false);
      const { getByTestId, queryByText } = render(<Header />);

      expect(queryByText('dashboard')).toBeNull();
      fireEvent.click(getByTestId('openMenuButton'));
      expect(queryByText('dashboard')).not.toBeNull();
    });

    it('should highlight the active menu item', () => {
      jest.requireMock('../../../hooks/useResponsive').mockReturnValue(false);
      jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue(BULK_EMAIL);
      const { getByText, getByTestId } = render(<Header />);
      fireEvent.click(getByTestId('openMenuButton'));

      expect(getByText('bulkEmail')).toHaveStyle({ fontWeight: 700 });

      expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('companies')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('contacts')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('logistics')).toHaveStyle({ fontWeight: 400 });
    });

    it('should highlight myTasks menu item', () => {
      jest.requireMock('../../../hooks/useResponsive').mockReturnValue(false);
      jest.spyOn(mockRouter, 'pathname', 'get').mockReturnValue(MY_TASKS);
      const { getByText, getByTestId } = render(<Header />);
      fireEvent.click(getByTestId('openMenuButton'));

      expect(getByText('myTasks')).toHaveStyle({ fontWeight: 700 });

      expect(getByText('contacts')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('companies')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('dashboard')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('stock')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('orders')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('bulkEmail')).toHaveStyle({ fontWeight: 400 });
      expect(getByText('logistics')).toHaveStyle({ fontWeight: 400 });
    });
  });
});
