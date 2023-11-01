import useSecurity from '../hooks/useSecurity';
import { Group } from '../stores/security/types';
import can from '../utils/can';

export default function Can({
  children,
  requiredGroups,
}: { children: JSX.Element | JSX.Element[], requiredGroups?: Group[] }) {
  const { state: { user } } = useSecurity();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return can(user?.groups || [], requiredGroups) && <>{children}</>;
}

Can.defaultProps = {
  requiredGroups: [],
};
