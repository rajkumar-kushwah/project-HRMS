/// <reference types="node" />

import { prisma } from "../src/config/db.ts";
import { permissionCategories } from "./permissions.seed.ts";

async function main() {
  console.log("Seeding permissions...");

  //  create permissions
  const permissions = permissionCategories.flatMap((category) =>
    category.permissions.map((action) => ({
      name: `${action}_${category.module}`,
      module: category.module,
      action
    }))
  );

  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true
  });

  console.log("Permissions seeded successfully");

  // create roles
  console.log("Seeding roles...");

  await prisma.role.createMany({
    data: [
      { name: "SUPER_ADMIN", description: "System Owner with full access" },
      { name: "HR", description: "HR Manager role" },
      { name: "EMPLOYEE", description: "Basic employee role" }
    ],
    skipDuplicates: true
  });

  //  assign all permissions to SUPER_ADMIN
  const allPermissions = await prisma.permission.findMany();

  const superAdmin = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN" }
  });

  if (superAdmin) {
    await prisma.role.update({
      where: { id: superAdmin.id },
      data: {
        permissions: {
          set: allPermissions.map((perm) => ({ id: perm.id }))
        }
      }
    });

    console.log("Super admin role seeded successfully ");
  }

  console.log("Seeding completed ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });