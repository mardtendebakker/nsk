import { User } from '../stores/security';
import can from './can';

const user: User = {
  username: 'string',
  email: 'imamharir@gmail.com',
  groups: ['local'],
  emailVerified: true,
  modules: [],
};

describe('can function tests', () => {
  it('should return true', () => {
    const result = can({ user, requiredGroups: ['local', 'admin'] });
    expect(result).toBeTruthy();
  });

  it('should return false', () => {
    const result = can({ user, requiredGroups: ['admin'] });
    expect(result).toBeFalsy();
  });
});
