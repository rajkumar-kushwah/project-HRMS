



export const hasRole = (user: any, allowedRoles: string[]) => {
  return allowedRoles.includes(user?.role?.name);
};