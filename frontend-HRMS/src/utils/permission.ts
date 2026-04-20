

export const hasPermission = (user: any, permission: string) => {
  return user?.roles?.some((role: any) =>
    role.permissions?.some((p: any) => p.name === permission)
  );
};