import { CompanyRelation } from '../../company/types/company-relation';
import { ContactGetPayload } from './contact-get-payload';

export type ContactRelation =
Omit<ContactGetPayload, 'company_contact_company_idTocompany'>
& {
  contact?: ContactGetPayload;
  company_contact_company_idTocompany: CompanyRelation;
};
