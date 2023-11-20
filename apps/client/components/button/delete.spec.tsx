import { fireEvent, render, waitFor } from '@testing-library/react';
import Delete from './delete';

describe('delete', () => {
  describe('tooltip mode', () => {
    it('matches snapshot', () => {
      const { asFragment, queryByText } = render(<Delete onClick={() => {}} tooltip />);
      expect(asFragment()).toMatchSnapshot();
      expect(queryByText('delete')).toBeNull();
    });
    it('handles click', async () => {
      const onClick = jest.fn();
      const { getByRole, getByText } = render(<Delete onClick={onClick} tooltip />);
      await waitFor(() => { fireEvent.click(getByRole('button')); });
      fireEvent.click(getByText('deleteConfirm'));

      expect(onClick).toHaveBeenCalled();
    });
    it('disables click', () => {
      const { getByRole, queryByText } = render(<Delete onClick={() => {}} disabled tooltip />);
      fireEvent.click(getByRole('button'));

      expect(queryByText('deleteConfirm')).toBeNull();
    });
  });
  describe('button mode', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(<Delete onClick={() => {}} />);
      expect(asFragment()).toMatchSnapshot();
    });
    it('handles click', async () => {
      const onClick = jest.fn();
      const { getByRole, getByText } = render(<Delete onClick={onClick} />);
      await waitFor(() => { fireEvent.click(getByRole('button')); });
      fireEvent.click(getByText('deleteConfirm'));

      expect(onClick).toHaveBeenCalled();
    });
    it('disables click', () => {
      const { getByRole, queryByText } = render(<Delete onClick={() => {}} disabled />);
      fireEvent.click(getByRole('button'));

      expect(queryByText('deleteConfirm')).toBeNull();
    });
  });
});
