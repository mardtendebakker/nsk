import { fireEvent, render } from '@testing-library/react';
import Edit from './edit';

describe('edit', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Edit onClick={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('handles click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Edit onClick={onClick} />);
    fireEvent.click(getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
  it('disables click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Edit onClick={onClick} disabled />);
    fireEvent.click(getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
