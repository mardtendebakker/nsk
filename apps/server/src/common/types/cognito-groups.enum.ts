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

export const SALE_UPLOADER_GROUPS = [
  ...INTERNAL_GROUPS,
  CognitoGroups.PARTNER_SALE_UPLOADER,
];

export const ALL_MAIN_GROUPS = [
  ...SALE_UPLOADER_GROUPS,
  CognitoGroups.PARTNER,
];
