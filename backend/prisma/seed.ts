/// <reference types="node" />

import { prisma } from "../src/config/db.ts";
import { permissionCategories } from "./permissions.seed.ts";
import bcrypt from "bcrypt";

// super_admin  create function call 

async function createSuperAdmin(companyId: number) {
  console.log("Checking Super Admin user...");

  const superAdmincheck = await prisma.user.findFirst({
    where: {
      roles: {
        some: {
          name: "SUPER_ADMIN"
        }
      }
    }
  });

  if (superAdmincheck) {
    console.log("Super Admin user already exists");
    return;
  }

  const superAdminRole = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN" }
  })

  if (!superAdminRole) {
    console.log("SUPER_ADMIN role not found. Run role seeding first.");
    return;
  }

  const hashedPassword = await bcrypt.hash("super@admin1", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin1@gmail.com",
      password: hashedPassword,
      company: {
        connect: {
          id: companyId
        }
      },
      roles: {
        connect: {
          id: superAdminRole.id
        }
      }
    }
  });

  console.log("Super Admin user created successfully");

}


async function main() {
  console.log("Seeding permissions...");

  //  create permissions
  const permissions = permissionCategories.flatMap((category) =>
    category.permissions.map((action) => ({
      name: `${category.module}.${action}`,
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

  // create company 
  const company = await prisma.company.upsert({
    where: {
      email: "admin@codewithhrms.com"
    },
    update: {},
    create: {
      name: "Code With HRMS",
      email: "admin@codewithhrms.com",
      phone: "1234567890",
      address: "725, 7th Floor, SRS Tower Sector-31, Faridabad, Haryana - 121003",
      logo: "/nabu.png",
    }
  });

  await prisma.role.createMany({
    data: [
      { name: "SUPER_ADMIN", description: "System Owner with full access", companyId: company.id },
      { name: "HR", description: "HR Manager role", companyId: company.id },
      { name: "EMPLOYEE", description: "Basic employee role", companyId: company.id },
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

  // create super admin
  await createSuperAdmin(company.id);

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