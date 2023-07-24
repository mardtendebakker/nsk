import can from './can';

describe('can function tests', () => {
  it('should return true', () => {
    const result = can(['local'], ['local', 'admin']);
    expect(result).toBeTruthy();
  });

  it('should return false', () => {
    const result = can(['local'], ['admin']);
    expect(result).toBeFalsy();
  });
});
