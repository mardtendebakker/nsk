import { CompanyGetPayload } from './company-get-payload';

export type CompanyRelation = Omit<CompanyGetPayload, 'company'> & {
  company: CompanyGetPayload;
};
