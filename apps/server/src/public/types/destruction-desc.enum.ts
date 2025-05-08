import { DataDestruction } from '../../calendar/pickup/types/destruction.enum';

export const DataDestructionDesc = {
  [DataDestruction.DATADESTRUCTION_NONE]: 'Geen HDD aangeleverd',
  [DataDestruction.DATADESTRUCTION_FORMAT]: 'HDD format',
  [DataDestruction.DATADESTRUCTION_STATEMENT]: 'Statement of destruction',
  [DataDestruction.DATADESTRUCTION_DEGAUSS]: 'HDD degaussen middels EMP. 100% onbruikbaar maken',
  [DataDestruction.DATADESTRUCTION_ERASEDATA]: 'HDD wipe report',
} as const;
