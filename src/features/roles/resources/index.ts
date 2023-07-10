import IPermission from './permission.interface';

export const TAGS = {
  BANK_ACCOUNTS: 'BANK ACCOUNTS',
  CLIENTS: 'CLIENTS',
  COMPANIES: 'COMPANIES',
  COUNTRIES: 'COUNTRIES',
  EMAILS: 'EMAILS',
  PAYMENTS_PLANS: 'PAYMENTS PLANS',
  PAYMENTS: 'PAYMENTS',
  ROLES: 'ROLES',
  PERMISSIONS: 'PERMISSIONS',
  PRODUCTS: 'PRODUCTS',
  PRODUCT_GROUPS: 'PRODUCT GROUPS',
  PROJECT_CATEGORIES: 'PROJECT CATEGORIES',
  PROJECTS: 'PROJECTS',
  QUOTES: 'QUOTES',
  SALES: 'SALES',
  USERS: 'USERS',
};

export const ACTIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SEND: 'SEND',
};

export const METHODS = {
  CREATE: 'POST',
  READ: 'GET',
  UPDATE: 'PUT',
  DELETE: 'DELETE',
  SEND: 'POST',
};

export const TAGS_LIST = [
  TAGS.BANK_ACCOUNTS,
  TAGS.CLIENTS,
  TAGS.COMPANIES,
  TAGS.COUNTRIES,
  TAGS.EMAILS,
  TAGS.PAYMENTS_PLANS,
  TAGS.PAYMENTS,
  TAGS.ROLES,
  TAGS.PRODUCTS,
  TAGS.PRODUCT_GROUPS,
  TAGS.PROJECT_CATEGORIES,
  TAGS.PROJECTS,
  TAGS.QUOTES,
  TAGS.SALES,
  TAGS.USERS,
];

const PERMISSIONS: any = {};

/**
 * BANK_ACCOUNTS permissions
 */
PERMISSIONS[TAGS.BANK_ACCOUNTS] = [
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'List all Bank accounts',
    path: '/bank-accounts/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'Read a specific bank account',
    path: '/bank-accounts',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'Create bank accounts',
    path: '/bank-accounts',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'Update a specific bank account',
    path: '/bank-accounts',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'Delete a specific bank account',
    path: '/bank-accounts',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.BANK_ACCOUNTS,
    code: 'Read all clients bank accounts',
    path: '/bank-accounts/client',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * CLIENTS permissions
 */
PERMISSIONS[TAGS.CLIENTS] = [
  {
    tag: TAGS.CLIENTS,
    code: 'List all company clients',
    path: '/clients/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.CLIENTS,
    code: 'Read a specific client account',
    path: '/clients',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.CLIENTS,
    code: 'Create client accounts',
    path: '/clients',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.CLIENTS,
    code: 'Update a specific client account',
    path: '/clients',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.CLIENTS,
    code: 'Delete a specific client account',
    path: '/clients',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.CLIENTS,
    code: 'Read number of clients By Company',
    path: '/clients/counts',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * COMPANIES permissions
 */
PERMISSIONS[TAGS.COMPANIES] = [
  {
    tag: TAGS.COMPANIES,
    code: 'List all user Companies',
    path: '/companies',
    action: ACTIONS.READ,
    params: [],
  },
  {
    tag: TAGS.COMPANIES,
    code: 'Read a specific Company account',
    path: '/companies',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.COMPANIES,
    code: 'Create Company accounts',
    path: '/companies',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.COMPANIES,
    code: 'Update a specific Company account',
    path: '/companies',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.COMPANIES,
    code: 'Delete a specific Company account',
    path: '/companies',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.COMPANIES,
    code: 'Read all admins account in a specific company',
    path: '/companies/admins',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.COMPANIES,
    code: "Read all user's companies accounts",
    path: '/companies/user',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * COUNTRIES permissions
 */
PERMISSIONS[TAGS.COUNTRIES] = [
  {
    tag: TAGS.COUNTRIES,
    code: 'List all countries',
    path: '/countries',
    action: ACTIONS.READ,
    params: [],
  },
  {
    tag: TAGS.COUNTRIES,
    code: 'Read a specific country',
    path: '/countries',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.COUNTRIES,
    code: 'Create countries',
    path: '/countries',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.COUNTRIES,
    code: 'Update a specific country',
    path: '/countries',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.COUNTRIES,
    code: 'Delete a specific country',
    path: '/countries',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
];

/**
 * EMAILS permissions
 */
PERMISSIONS[TAGS.EMAILS] = [];

/**
 * PAYMENTS_PLANS permissions
 */
PERMISSIONS[TAGS.PAYMENTS_PLANS] = [
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'List all company payment plans',
    path: '/payment-plans/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'Read a specific payment plans',
    path: '/payment-plans',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'Create payment plans',
    path: '/payment-plans',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'Update a specific payment plan',
    path: '/payment-plans',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'Delete a specific payment plan',
    path: '/payment-plans',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS_PLANS,
    code: 'Read all client payment plans',
    path: '/payment-plans/client',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * PAYMENTS permissions
 */
PERMISSIONS[TAGS.PAYMENTS] = [
  {
    tag: TAGS.PAYMENTS,
    code: 'List all company payments',
    path: '/payments/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS,
    code: 'Read a specific payment',
    path: '/payments',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS,
    code: 'Create payments',
    path: '/payments',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PAYMENTS,
    code: 'Update a specific payment',
    path: '/payments',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS,
    code: 'Delete a specific payment',
    path: '/payments',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.PAYMENTS,
    code: 'Read all client payments',
    path: '/payments/client',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * ROLES permissions
 */
PERMISSIONS[TAGS.ROLES] = [
  {
    tag: TAGS.ROLES,
    code: 'List all company roles',
    path: '/roles/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.ROLES,
    code: 'Read a specific role',
    path: '/roles',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.ROLES,
    code: 'Create roles',
    path: '/roles',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.ROLES,
    code: 'Update a specific role',
    path: '/roles',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.ROLES,
    code: 'Delete a specific role',
    path: '/roles',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.ROLES,
    code: 'Read all permissions',
    path: '/roles/permissions',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * PRODUCT_GROUPS permissions
 */
PERMISSIONS[TAGS.PRODUCT_GROUPS] = [
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'List all company product groups',
    path: '/product-groups/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Read a specific product group',
    path: '/product-groups',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Create product groups',
    path: '/product-groups',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Update a specific product group',
    path: '/product-groups',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Delete a specific product group',
    path: '/product-groups',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  //
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Read product product groups',
    path: '/product-groups/products',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCT_GROUPS,
    code: 'Read project product groups',
    path: '/product-groups/project',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * PRODUCTS permissions
 */
PERMISSIONS[TAGS.PRODUCTS] = [
  {
    tag: TAGS.PRODUCTS,
    code: 'List all company products',
    path: '/products/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCTS,
    code: 'Read a specific product',
    path: '/products',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCTS,
    code: 'Create products',
    path: '/products',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PRODUCTS,
    code: 'Update a specific product',
    path: '/products',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PRODUCTS,
    code: 'Delete a specific product',
    path: '/products',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
];

/**
 * PROJECT_CATEGORIES permissions
 */
PERMISSIONS[TAGS.PROJECT_CATEGORIES] = [
  {
    tag: TAGS.PROJECT_CATEGORIES,
    code: 'List all company project categories',
    path: '/project-categories/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECT_CATEGORIES,
    code: 'Read a specific project category',
    path: '/project-categories',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECT_CATEGORIES,
    code: 'Create categories',
    path: '/project-categories',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PROJECT_CATEGORIES,
    code: 'Update a specific project category',
    path: '/project-categories',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECT_CATEGORIES,
    code: 'Delete a specific project category',
    path: '/project-categories',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
];

/**
 * PROJECTS permissions
 */
PERMISSIONS[TAGS.PROJECTS] = [
  {
    tag: TAGS.PROJECTS,
    code: 'List all company projects',
    path: '/projects/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Read a specific project',
    path: '/projects',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Create projects',
    path: '/projects',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Update a specific project',
    path: '/projects',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Delete a specific project',
    path: '/projects',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Read all Company projects',
    path: '/projects/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.PROJECTS,
    code: 'Read all company projects',
    path: '/projects/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * QUOTES permissions
 */
PERMISSIONS[TAGS.QUOTES] = [
  {
    tag: TAGS.QUOTES,
    code: 'List all company quotes',
    path: '/quotes/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Read a specific quote',
    path: '/quotes',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Create quotes',
    path: '/quotes',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Update a specific quote',
    path: '/quotes',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Delete a specific quote',
    path: '/quotes',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Read product quotes',
    path: '/quotes/product',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.QUOTES,
    code: 'Read sale quotes',
    path: '/quotes/sale',
    action: ACTIONS.READ,
    params: ['id'],
  },
];

/**
 * SALES permissions
 */
PERMISSIONS[TAGS.SALES] = [
  {
    tag: TAGS.SALES,
    code: 'List all company sales',
    path: '/sales/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.SALES,
    code: 'Read a specific sale',
    path: '/sales',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.SALES,
    code: 'Create sales',
    path: '/sales',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.SALES,
    code: 'Update a specific sale',
    path: '/sales',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.SALES,
    code: 'Delete a specific sale',
    path: '/sales',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
  {
    tag: TAGS.SALES,
    code: 'Read client sales',
    path: '/sales/client',
    action: ACTIONS.READ,
    params: ['id'],
  }
];

/**
 * USERS permissions
 */
PERMISSIONS[TAGS.USERS] = [
  {
    tag: TAGS.USERS,
    code: 'List all company users',
    path: '/users/company',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.USERS,
    code: 'Read a specific company user',
    path: '/users',
    action: ACTIONS.READ,
    params: ['id'],
  },
  {
    tag: TAGS.USERS,
    code: 'Create company users',
    path: '/users/signup',
    action: ACTIONS.CREATE,
    params: [],
  },
  {
    tag: TAGS.USERS,
    code: 'Update a specific company user',
    path: '/users',
    action: ACTIONS.UPDATE,
    params: ['id'],
  },
  {
    tag: TAGS.USERS,
    code: 'Delete a specific company user',
    path: '/users',
    action: ACTIONS.DELETE,
    params: ['id'],
  },
];

export const getPermissions = (tag?: string): any => {
  if (tag) return PERMISSIONS[tag];

  return PERMISSIONS;
};

export const getPermissionByCode = (code: string): any => {
  // eslint-disable-next-line no-restricted-syntax
  for (const permissionSet of Object.values(PERMISSIONS)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const permission of permissionSet as Array<IPermission>) {
      if ((permission as IPermission).code === code) return permission;
    }
  }

  return null;
};

const PREFIX = '/api/v1';

export const isAllowTo = (
  code: string,
  ReqPath: string,
  ReqMethod: string,
  ReqParamsKeys: Array<string>,
): boolean => {
  const permission: IPermission = getPermissionByCode(code);

  if (
    ReqPath.startsWith(PREFIX.concat(permission.path)) &&
    (METHODS as any)[permission.action] === ReqMethod &&
    ReqParamsKeys.every(paramkey => permission.params.includes(paramkey))
  )
    return true;

  return false;
};

export default PERMISSIONS;
