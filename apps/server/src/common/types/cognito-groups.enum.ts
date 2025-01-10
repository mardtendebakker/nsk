export enum CognitoGroups {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  LOGISTICS = 'logistics',
  LOCAL = 'local',
  PARTNER_SALE_UPLOADER = 'partner_sale_uploader',
  STORE_PUBLISHER = 'store_publisher',
  PARTNER = 'partner',
}

export const SUPER_ADMIN_GROUPS = [
  CognitoGroups.SUPER_ADMIN,
];

export const ADMINS_GROUPS = [
  ...SUPER_ADMIN_GROUPS,
  CognitoGroups.ADMIN,
];

export const MANAGER_GROUPS = [
  ...ADMINS_GROUPS,
  CognitoGroups.MANAGER,
];

export const LOGISTICS_GROUPS = [
  ...MANAGER_GROUPS,
  CognitoGroups.LOGISTICS,
];

export const STORE_PUBLISHER_GROUPS = [
  ...MANAGER_GROUPS,
  CognitoGroups.STORE_PUBLISHER,
];

export const LOCAL_GROUPS = [
  ...LOGISTICS_GROUPS,
  CognitoGroups.STORE_PUBLISHER,
  CognitoGroups.LOCAL,
];

export const PARTNERS_GROUPS = [
  CognitoGroups.PARTNER_SALE_UPLOADER,
  CognitoGroups.PARTNER,
];

export const ALL_MAIN_GROUPS = [
  ...LOCAL_GROUPS,
  ...PARTNERS_GROUPS,
];

export const SALE_UPLOADER_GROUPS = [
  ...MANAGER_GROUPS,
  CognitoGroups.PARTNER_SALE_UPLOADER,
];
