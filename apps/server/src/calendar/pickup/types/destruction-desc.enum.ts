import { DataDestruction } from './destruction.enum';

export const DataDestructionDesc = {
  [DataDestruction.DATADESTRUCTION_NONE]: 'Geen HDD aangeleverd',
  [DataDestruction.DATADESTRUCTION_FORMAT]: 'HDD format',
  [DataDestruction.DATADESTRUCTION_STATEMENT]: 'Statement of destruction',
  [DataDestruction.DATADESTRUCTION_SHRED]: 'HDD op locatie shredden a €12,50 (extra 0.89ct per KM)',
  [DataDestruction.DATADESTRUCTION_KILLDISK]: 'HDD wipe report',
} as const;
