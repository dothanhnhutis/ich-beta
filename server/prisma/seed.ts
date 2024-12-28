import { permissions } from "@/configs/constants";
import prisma from "@/services/db";
import { hashData } from "@/utils/helper";

async function initDB() {
  const superAdminRole = await prisma.roles.create({
    data: {
      name: "super admin",
      permissions: permissions.map((r) => r),
    },
  });
  const adminRole = await prisma.roles.create({
    data: {
      name: "admin",
      permissions: [
        "write:users",
        "read:users",
        "update:users",
        "delete:users",

        "write:departments",
        "read:departments",
        "update:departments",
        "delete:departments",

        "write:displays",
        "read:displays",
        "update:displays",
        "delete:displays",

        "write:products",
        "read:products",
        "update:products",
        "delete:products",
      ],
    },
  });

  const workerRole = await prisma.roles.create({
    data: {
      name: "worker",
      permissions: ["read:displays", "read:departments", "read:products"],
    },
  });

  await prisma.users.create({
    data: {
      email: "dothanhnhutis@gmail.com",
      password: await hashData("@Abc123123"),
      username: "Thanh Nhựt",
      birthDate: "09/10/1999",
      gender: "MALE",
      phoneNumber: "0948548844",
      emailVerified: true,
      usersRoles: {
        create: [
          {
            roleId: superAdminRole.id,
          },
        ],
      },
    },
  });

  await prisma.users.create({
    data: {
      email: "i.c.h.vietnam2020@gmail.com",
      password: await hashData("@Abc123123"),
      username: "ICH",
      birthDate: "24/12/1989",
      gender: "MALE",
      phoneNumber: "0707000004",
      emailVerified: true,
      usersRoles: {
        create: [
          {
            roleId: adminRole.id,
          },
        ],
      },
    },
  });

  await prisma.users.create({
    data: {
      email: "gaconght001@gmail.com",
      password: await hashData("@Abc123123"),
      username: "Nhân viên nhà máy I.C.H",
      birthDate: "24/12/2020",
      gender: "MALE",
      phoneNumber: "0906640464",
      emailVerified: true,
      usersRoles: {
        create: [
          {
            roleId: workerRole.id,
          },
        ],
      },
    },
  });

  const factory = await prisma.factorys.create({
    data: {
      name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
    },
  });

  await prisma.departments.createMany({
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
