import { memo } from 'react';
import UserRolePicker from '../input/userRolePicker';

export default memo(
  UserRolePicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
