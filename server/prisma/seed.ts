import {
  SUPER_ADMIN_ROLE_PERMISSIONS,
  USER_ROLE_PERMISSIONS,
} from "@/configs/permission";
import prisma from "@/services/db";
import { hashData } from "@/utils/helper";

async function initDB() {
  await prisma.users.deleteMany();

  const user = await prisma.users.create({
    data: {
      email: "gaconght001@gmail.com",
      password: await hashData("@Abc123123"),
      username: "ICH",
      birthDate: "30/11/2024",
      gender: "MALE",
      phoneNumber: "0707000004",
      emailVerified: true,
    },
  });

  const plan1 = await prisma.plans.create({
    data: {
      name: "Phòng 1",
    },
  });

  const plan2 = await prisma.plans.create({
    data: {
      name: "Phòng 2",
    },
  });

  const task = await prisma.tasks.create({
    data: {
      title: "test 1",
      subTitle: "some text",
      plan: {
        connect: {
          id: plan1.id,
        },
      },
    },
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
