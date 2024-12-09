import prisma from "@/services/db";
import { hashData } from "@/utils/helper";

async function initDB() {
  await prisma.users.deleteMany();
  await prisma.roles.deleteMany();

  const adminRole = await prisma.roles.create({
    data: {
      name: "admin",
      policies: {
        create: [
          {
            action: "create",
            resource: "policies",
            description: "create policy",
          },
          {
            action: "read",
            resource: "policies",
            description: "read policy",
          },
          {
            action: "update",
            resource: "policies",
            description: "update policy",
          },
          {
            action: "delete",
            resource: "policies",
            description: "delete policy",
          },
          {
            action: "create",
            resource: "roles",
            description: "create role",
          },
          {
            action: "read",
            resource: "roles",
            description: "read role",
          },
          {
            action: "update",
            resource: "roles",
            description: "update role",
          },
          {
            action: "delete",
            resource: "roles",
            description: "delete role",
          },
        ],
      },
    },
  });

  const baseRole = await prisma.roles.create({
    data: {
      name: "normal user",
    },
  });

  const user = await prisma.users.create({
    data: {
      email: "gaconght001@gmail.com",
      password: await hashData("@Abc123123"),
      username: "ICH",
      birthDate: "30/11/2024",
      gender: "MALE",
      roleId: adminRole.id,
      phoneNumber: "0707000004",
      emailVerified: true,
    },
  });

  await prisma.factorys.deleteMany();

  const factory = await prisma.factorys.create({
    data: {
      name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
    },
  });

  const department = await prisma.departments.createMany({
    data: [
      {
        name: "Phòng 1",
        factoryId: factory.id,
      },
      {
        name: "Phòng 2",
        factoryId: factory.id,
      },
    ],
  });
}

initDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
