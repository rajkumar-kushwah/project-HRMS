


export const hasPermission = (user: any, permission: string) => {
  return user?.permission?.includes(permission);
};