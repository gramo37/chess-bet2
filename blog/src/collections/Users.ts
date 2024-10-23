import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,  // Enable authentication for the users
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      defaultValue: 'admin',  // Default and only option is 'admin'
      required: true,
    },
  ],
  access: {
    // Restrict access to the admin panel to only users with the 'admin' role
    admin: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
    // Allow only admins to read data via API routes
    read: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
    // Allow only admins to create new data (posts, etc.)
    create: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
    // Allow only admins to update existing data
    update: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
    // Allow only admins to delete data
    delete: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
  },
};

export default Users;
