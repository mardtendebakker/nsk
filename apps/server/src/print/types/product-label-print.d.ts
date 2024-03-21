import { ProductRelationAttributeProcessed } from '../../stock/types/product-relation-attribute-processed';
import { CompanyLabelPrint } from './company-label-print';
import { UserLabelPrint } from './user-label-print';

export type ProductLabelPrint = ProductRelationAttributeProcessed & UserLabelPrint & CompanyLabelPrint;
