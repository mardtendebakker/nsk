import { DataDestruction } from '../../calendar/pickup/types/destruction.enum';

export const DataDestructionExtra = {
  [DataDestruction.DATADESTRUCTION_NONE]: '',
  [DataDestruction.DATADESTRUCTION_FORMAT]: '',
  [DataDestruction.DATADESTRUCTION_STATEMENT]: '',
  [DataDestruction.DATADESTRUCTION_DEGAUSS]: '',
  [DataDestruction.DATADESTRUCTION_ERASEDATA]: 'Indien wipen niet lukt wordt de drager degaussed (EMP)',
} as const;
