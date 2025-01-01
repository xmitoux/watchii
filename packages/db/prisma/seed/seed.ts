import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

main()
  .catch((error) => {
    console.error(error);
    throw new Error(error);
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .finally(() => {
    prisma.$disconnect();
  });
