import { memo } from 'react';
import TaskStatusPicker from '../input/taskStatusPicker';

export default memo(
  TaskStatusPicker,
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps),
);
