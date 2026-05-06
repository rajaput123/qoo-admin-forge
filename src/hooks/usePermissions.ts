export const usePermissions = () => {
  // Temporary implementation - always allow access
  // TODO: Implement proper permission checking
  return {
    checkModuleAccess: (module: string) => true,
    checkWriteAccess: (module: string) => true,
    isReadOnly: false,
    user: { 
      name: 'Admin',
      role: 'super_admin',
      id: '1',
      email: 'admin@temple.org'
    }
  };
};
