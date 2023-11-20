import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Pagination from './pagination';

function RenderC({ onNext, onPrevious } : { onNext:() => void, onPrevious:() => void }) {
  return (
    <Pagination
      date={new Date('2020-10-10')}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
}

describe('Pagination component', () => {
  it('matches snapshot', () => {
    const { asFragment, getByText } = render(<RenderC onNext={() => {}} onPrevious={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('10 October 2020')).toBeInTheDocument();
  });
  it('handles click properly', () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    const { getByTestId } = render(<RenderC onNext={onNext} onPrevious={onPrevious} />);
    fireEvent.click(getByTestId('previous'));
    fireEvent.click(getByTestId('next'));

    expect(onPrevious).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });
});
