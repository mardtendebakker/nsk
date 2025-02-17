import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import DriversList from './driversList';

function RenderC({ onClick } : { onClick:(logistiId: number) => void }) {
  return (
    <DriversList
      drivers={[{
        id: 1,
        username: 'username',
        first_name: 'firstname',
        last_name: 'lastname',
        email: 'email@gmail.com',
      }, {
        id: 2,
        username: 'username2',
        first_name: 'firstname2',
        last_name: 'lastname2',
        email: 'email2@gmail.com',
      }]}
      onClick={onClick}
      selectedDriverIds={[1]}
    />
  );
}

describe('LogisticsList component', () => {
  it('matches snapshot', () => {
    const { asFragment, getByText } = render(<RenderC onClick={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('username')).toBeInTheDocument();
    expect(getByText('username2')).toBeInTheDocument();
  });
  it('handles click properly', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RenderC onClick={onClick} />);
    fireEvent.click(getByText('everyone'));
    fireEvent.click(getByText('username'));
    fireEvent.click(getByText('username2'));

    expect(onClick).toHaveBeenCalledWith(0);
    expect(onClick).toHaveBeenCalledWith(1);
    expect(onClick).toHaveBeenCalledWith(2);
  });
});
