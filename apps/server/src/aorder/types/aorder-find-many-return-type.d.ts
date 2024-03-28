import { FindManyReturnType } from '../../common/types/find-many-return-type';
import { AOrderPayloadRelation } from './aorder-payload-relation';

export type AOrderFindManyReturnType = Omit<FindManyReturnType, 'data'> & {
  data: AOrderPayloadRelation[]
};
