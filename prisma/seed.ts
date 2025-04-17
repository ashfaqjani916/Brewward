import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Seed ingredients
  const ingredients = ['sugar', 'milk', 'ice', 'coffee', 'chocochips'];
  for (const name of ingredients) {
    await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Generate 100 QR codes with random ingredient mappings
  const ingredientRecords = await prisma.ingredient.findMany();
  for (let i = 0; i < 100; i++) {
    const randomIngredient = ingredientRecords[Math.floor(Math.random() * ingredientRecords.length)];
    await prisma.qrCode.create({
      data: {
        id: uuidv4(),
        ingredientId: randomIngredient.id,
      },
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
