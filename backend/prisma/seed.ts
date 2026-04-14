/// <reference types="node" />


import { prisma } from "../src/config/db.ts";
import { permissionCategories } from "./permissions.seed.ts"



async function main() {
    console.log('Seeding permissions...')
    // create permissions with flatmap and skipDuplicates and seed and categories wise 
     const permissions = permissionCategories.flatMap((category) =>
    category.permissions.map((perm) => ({
      name: `${category.module}_${perm}`,
      category: category.module
    }))
  );

    await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true  // important
    });

    console.log('Permissions seeded successfully')
}

console.log("Seeding roles...");

// create roles super admin, hr, employee
await prisma.role.createMany({
    data: [
        { name: "SUPER_ADMIN", description: "System Owner with full access" },
        { name: "HR", description: "HR Manager role" },
        { name: "EMPLOYEE", description: "Basic employee role" }
    ],
    skipDuplicates: true
});

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async ()=> {
        await prisma.$disconnect();
    })