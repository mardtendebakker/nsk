import { isPassword } from './validator';

describe('isPassword', () => {
  it('returns true with valid password', () => {
    expect(isPassword('P@ssw0rd')).toBeTruthy();
  });
  it('returns false with invalid password, bad length', () => {
    expect(isPassword('P@ssw0r')).toBeFalsy();
  });
  it('returns false with invalid password, uppercase needed', () => {
    expect(isPassword('p@ssw0rd')).toBeFalsy();
  });
  it('returns false with invalid password, number needed', () => {
    expect(isPassword('P@ssword')).toBeFalsy();
  });
  it('returns false with invalid password, alphabetical character needed', () => {
    expect(isPassword('1@123456789')).toBeFalsy();
  });
});
