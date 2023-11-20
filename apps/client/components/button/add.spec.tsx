import { fireEvent, render } from '@testing-library/react';
import Add from './add';

describe('add', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Add onClick={() => {}} title="title" />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('handles click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Add onClick={onClick} />);
    fireEvent.click(getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
  it('disables click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Add onClick={onClick} disabled />);
    fireEvent.click(getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
