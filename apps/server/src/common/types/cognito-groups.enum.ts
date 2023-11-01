export enum CognitoGroups {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  LOGISTICS = 'logistics',
  PARTNER_SALE_UPLOADER = 'partner_sale_uploader',
  PARTNER = 'partner',
  LOCAL = 'local',
}

export const ADMINS_GROUPS = [
  CognitoGroups.SUPER_ADMIN,
  CognitoGroups.ADMIN
];

export const MANAGER_GROUPS = [
  ...ADMINS_GROUPS,
  CognitoGroups.MANAGER,
];

export const INTERNAL_GROUPS = [
  ...MANAGER_GROUPS,
  CognitoGroups.LOGISTICS,
];

export const PARTNERS_GROUPS = [
  CognitoGroups.PARTNER_SALE_UPLOADER,
  CognitoGroups.PARTNER,
];

export const ALL_MAIN_GROUPS = [
  ...INTERNAL_GROUPS,
  ...PARTNERS_GROUPS,
];

export const SALE_UPLOADER_GROUPS = [
  ...MANAGER_GROUPS,
  CognitoGroups.PARTNER_SALE_UPLOADER,
];
