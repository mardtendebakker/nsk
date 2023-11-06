import useSecurity from '../hooks/useSecurity';
import { Group } from '../stores/security/types';
import can from '../utils/can';

export default function Can({
  children,
  requiredGroups,
  disableDefaultGroups,
}: { children: JSX.Element | JSX.Element[], requiredGroups?: Group[], disableDefaultGroups?: boolean }) {
  const { state: { user } } = useSecurity();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return can(user?.groups || [], requiredGroups, disableDefaultGroups) && <>{children}</>;
}

Can.defaultProps = {
  requiredGroups: [],
  disableDefaultGroups: false,
};
