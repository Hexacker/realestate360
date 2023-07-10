import {  RoleDTO } from '../../features/roles';
import DefaultsRoles from '../../features/roles/resources/default_roles';

const roles = async (): Promise<RoleDTO[]> => {
  const rolesData: RoleDTO[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const roleRaw of DefaultsRoles) {
    const role: RoleDTO = new RoleDTO();
    role.isActivated = true;
    role.permissions = roleRaw.permissions || [];
    role.name = roleRaw.name;
    rolesData.push(role);
  }
  return rolesData;
};
export default roles;
