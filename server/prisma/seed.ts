import { Condition } from "@/middlewares/checkpolicy";
import prisma from "@/services/db";
import { hashData } from "@/utils/helper";

type Policy = {
  action: string;
  resource: string;
  description: string;
  condition?: Condition;
};
const adminPolicies: Policy[] = [
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
    resource: "users",
    description: "create user",
  },
  {
    action: "read",
    resource: "users",
    description: "read user",
  },
  {
    action: "update",
    resource: "users",
    description: "update user",
  },
  {
    action: "delete",
    resource: "users",
    description: "delete user",
  },
  {
    action: "create",
    resource: "displays",
    description: "create display",
  },
  {
    action: "read",
    resource: "displays",
    description: "read display",
  },
  {
    action: "update",
    resource: "displays",
    description: "update display",
  },
  {
    action: "delete",
    resource: "displays",
    description: "delete display",
  },
];

async function initDB() {
  await prisma.policies.deleteMany();
  await prisma.users.deleteMany();

  await prisma.users.create({
    data: {
      email: "gaconght@gmail.com",
      password: await hashData("@Abc123123"),
      username: "ICH",
      birthDate: "30/11/2024",
      gender: "MALE",
      phoneNumber: "0707000004",
      emailVerified: true,
      usersPolicies: {
        create: adminPolicies.map((p) => ({
          policy: {
            create: p,
          },
        })),
      },
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
