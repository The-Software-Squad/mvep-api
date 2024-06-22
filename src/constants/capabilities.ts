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