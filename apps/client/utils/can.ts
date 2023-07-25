import _ from 'lodash';
import { Group } from '../stores/security/types';

export default function can(userGroups: Group[], requiredGroups: Group[]): boolean {
  return _.intersection(userGroups, requiredGroups).length > 0;
}
