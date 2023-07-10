import roles from './data/roles.data';
import RolesService from '../features/roles/roles.service';
import { RoleDTO } from '../features/roles';

const seedRoles = async (): Promise<void> => {
  try {
    const rolesData: RoleDTO[] = await roles();
    // eslint-disable-next-line no-restricted-syntax
    for (const role of rolesData) {
      // eslint-disable-next-line no-await-in-loop
      await RolesService.createRole(role);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error roles seeds ${error}`);
  }
};

export default seedRoles;
