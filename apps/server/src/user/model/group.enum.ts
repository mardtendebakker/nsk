export enum Group {
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
  Group.SUPER_ADMIN,
];

export const ADMINS_GROUPS = [
  ...SUPER_ADMIN_GROUPS,
  Group.ADMIN,
];

export const MANAGER_GROUPS = [
  ...ADMINS_GROUPS,
  Group.MANAGER,
];

export const LOGISTICS_GROUPS = [
  ...MANAGER_GROUPS,
  Group.LOGISTICS,
];

export const STORE_PUBLISHER_GROUPS = [
  ...MANAGER_GROUPS,
  Group.STORE_PUBLISHER,
];

export const LOCAL_GROUPS = [
  ...LOGISTICS_GROUPS,
  Group.STORE_PUBLISHER,
  Group.LOCAL,
];

export const PARTNERS_GROUPS = [
  Group.PARTNER_SALE_UPLOADER,
  Group.PARTNER,
];

export const ALL_MAIN_GROUPS = [
  ...LOCAL_GROUPS,
  ...PARTNERS_GROUPS,
];

export const SALE_UPLOADER_GROUPS = [
  ...MANAGER_GROUPS,
  Group.PARTNER_SALE_UPLOADER,
];
