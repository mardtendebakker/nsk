import { memo } from 'react';
import UserStatusPicker from '../input/userStatusPicker';

export default memo(
  UserStatusPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
