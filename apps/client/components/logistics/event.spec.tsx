import { fireEvent, render } from '@testing-library/react';
import Event from './event';

function RenderComponent({ onClick }:{ onClick:()=> void }) {
  return (
    <Event
      type="delivery"
      logisticService={{
        event_date: '',
        event_title: 'eventTitle',
        id: 1,
        logistic: {
          id: 1,
          username: 'string',
          firstname: 'string',
          lastname: 'string',
          email: 'string',
        },
        order: {
          id: 1,
          order_nr: 'string',
          order_status: { color: 'color' },
          supplier: {
            city: 'string',
            country: 'string',
            state: 'string',
            zip: 'string',
            street: 'string',
            phone: 'string',
            name: 'string',
            email: 'string',
            representative: 'string',
          },
          customer: {
            city: 'string',
            country: 'string',
            state: 'string',
            zip: 'string',
            street: 'string',
            phone: 'string',
            name: 'string',
            email: 'string',
            representative: 'string',
          },
        },
      }}
      top="1rem"
      height="1rem"
      left="1rem"
      width="1rem"
      onClick={onClick}
    />
  );
}

describe('event', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<RenderComponent onClick={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles click', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<RenderComponent onClick={onClick} />);
    fireEvent.click(getByTestId('event'));
    expect(onClick).toHaveBeenCalled();
  });
});
