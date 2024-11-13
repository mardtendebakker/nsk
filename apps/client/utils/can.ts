import _ from 'lodash';
import { Group, User } from '../stores/security';

export default function can({ user, requiredGroups } : { user: User, requiredGroups?: Group[] }): boolean {
  let supportsGroups = true;

  if (Array.isArray(requiredGroups)) {
    supportsGroups = _.intersection(user.groups, [...requiredGroups, 'super_admin']).length > 0;
  }

  return supportsGroups;
}
