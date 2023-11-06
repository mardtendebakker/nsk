import _ from 'lodash';
import { Group } from '../stores/security/types';

export default function can(userGroups: Group[], requiredGroups: Group[], disableDefaultGroups = false): boolean {
  return _.intersection(userGroups, disableDefaultGroups ? requiredGroups : [...requiredGroups, 'admin', 'super_admin']).length > 0;
}
