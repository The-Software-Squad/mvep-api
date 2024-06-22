export const ROLE_CAPACITIES = {
    super_admin: 1,
    admin: 2,
    creator: 3,
    noob: 4
};

export const GLOBAL_CAPABILITIES = {
    sudo_users: {
      super_admin: {
        create: "CREATE_SUPER_ADMIN",
        update: "UPDATE_SUPER_ADMIN",
        read: "READ_SUPER_ADMIN",
        delete: "DELETE_SUPER_ADMIN",
      },
      admin: {
        create: "CREATE_ADMIN",
        update: "UPDATE_ADMIN",
        read: "READ_ADMIN",
        delete: "DELETE_ADMIN",
      },
      creator: {
        create: "CREATE_CREATOR",
        update: "UPDATE_CREATOR",
        read: "READ_CREATOR",
        delete: "DELETE_CREATOR",
      },
      noob: {
        create: "CREATE_NOOB",
        update: "UPDATE_NOOB",
        read: "READ_NOOB",
        delete: "DELETE_NOOB",
      },
    },
  };

  export const super_admin_caps = [
    GLOBAL_CAPABILITIES.sudo_users.super_admin.create,
    GLOBAL_CAPABILITIES.sudo_users.super_admin.read,
    GLOBAL_CAPABILITIES.sudo_users.super_admin.update,
    GLOBAL_CAPABILITIES.sudo_users.super_admin.delete,
  ];
  
  export const admin_caps = [
    GLOBAL_CAPABILITIES.sudo_users.admin.create,
    GLOBAL_CAPABILITIES.sudo_users.admin.read,
    GLOBAL_CAPABILITIES.sudo_users.admin.update,
    GLOBAL_CAPABILITIES.sudo_users.admin.delete,
  ];
  
  export const creator_caps = [
    GLOBAL_CAPABILITIES.sudo_users.creator.create,
    GLOBAL_CAPABILITIES.sudo_users.creator.read,
    GLOBAL_CAPABILITIES.sudo_users.creator.update,
    GLOBAL_CAPABILITIES.sudo_users.creator.delete,
  ];
  
  export const noob_caps = [
    GLOBAL_CAPABILITIES.sudo_users.noob.create,
    GLOBAL_CAPABILITIES.sudo_users.noob.read,
    GLOBAL_CAPABILITIES.sudo_users.noob.update,
    GLOBAL_CAPABILITIES.sudo_users.noob.delete,
  ];
  
  export const default_super_admin_caps = [
    ...super_admin_caps,
    ...admin_caps,
    ...creator_caps,
    ...noob_caps,
  ];
  