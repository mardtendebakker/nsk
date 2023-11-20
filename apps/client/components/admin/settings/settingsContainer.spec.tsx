import { render } from '@testing-library/react';
import SettingsContainer from './settingsContainer';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '' }),
}));

describe('settingsContainer', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<SettingsContainer><div /></SettingsContainer>);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders children', () => {
    const { getByText } = render(<SettingsContainer><div>child</div></SettingsContainer>);
    expect(getByText('child')).not.toBeNull();
  });
});
