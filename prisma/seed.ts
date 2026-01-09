import { prisma } from "../src/lib/prisma";

const USER_ID = "USER_UUID_TEST";

async function main() {
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: {},
    create: {
      id: USER_ID,
      email: "test@example.com",
      password: "test123",
    },
  });

  console.log("User ready");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
