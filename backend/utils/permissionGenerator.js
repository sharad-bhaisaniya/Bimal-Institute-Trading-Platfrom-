const Permission = require('../models/Permission');
const Role = require('../models/Role');

const generatePermissions = async () => {
  try {
    const modules = [
      { name: 'Users', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Roles', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Permissions', actions: ['read'] },
      { name: 'SMTP Settings', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'SMS Settings', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Razorpay Settings', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Digio Settings', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Dashboard', actions: ['read'] },
      { name: 'Blogs', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Blog Categories', actions: ['read', 'create', 'update', 'delete'] },
      { name: 'Media', actions: ['read', 'create', 'update', 'delete'] }
    ];

    const uniquePermissions = [];

    modules.forEach(mod => {
      mod.actions.forEach(action => {
        const permName = `${action}_${mod.name.toLowerCase().replace(/\s+/g, '_')}`;
        uniquePermissions.push({
          name: permName,
          module: mod.name,
          action: action,
          desc: `Can ${action} ${mod.name}`
        });
      });
    });

    console.log(`Auto-generating ${uniquePermissions.length} permissions...`);

    // Clear old permissions to remove any duplicates from previous manual seeds
    await Permission.deleteMany({});
    
    // Insert new clean permissions
    const insertedPermissions = await Permission.insertMany(uniquePermissions);
    
    // Find Super Admin role and assign all new permissions to it
    const superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (superAdminRole) {
      superAdminRole.permissions = insertedPermissions.map(p => p._id);
      await superAdminRole.save();
      console.log('Successfully assigned all permissions to Super Admin role.');
    } else {
      // Create Super Admin if it doesn't exist
      await Role.create({
        name: 'Super Admin',
        description: 'System Administrator with all permissions',
        permissions: insertedPermissions.map(p => p._id),
        isSystem: true
      });
      console.log('Created Super Admin role with all permissions.');
    }
    
    console.log('Permissions auto-generation complete. Old duplicates removed.');
  } catch (error) {
    console.error('Failed to auto-generate permissions:', error);
  }
};

module.exports = generatePermissions;
