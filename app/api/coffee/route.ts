import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MakeCoffeeRequestBody {
  type: 'Latte' | 'Mocha' | 'IcedCoffee';
  userId: number;
}

// Static coffee recipes
const coffeeRecipes: Record<string, string[]> = {
  Latte: ['milk', 'coffee', 'sugar'],
  Mocha: ['milk', 'coffee', 'chocochips', 'sugar'],
  IcedCoffee: ['ice', 'coffee', 'milk', 'sugar'],
};

// Static map of ingredient names to their IDs
const nameToIdMap: { [key: string]: number } = {
  sugar: 11,
  milk: 12,
  ice: 13,
  coffee: 14,
  chocochips: 15,
};

export async function POST(req: NextRequest) {
  try {
    const body: MakeCoffeeRequestBody = await req.json();
    const { type, userId } = body;

    if (!type || typeof userId !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid coffee type or userId' }, { status: 400 });
    }

    const requiredIngredients = coffeeRecipes[type];
    if (!requiredIngredients) {
      return NextResponse.json({ error: 'Invalid coffee type' }, { status: 400 });
    }

    // Check user's inventory
    const userInventory = await prisma.inventory.findMany({
      where: { userId },
      include: { ingredient: true },
    });

    // Normalize inventory map: ingredient name -> quantity
    const inventoryMap = new Map<string, number>(
      userInventory.map((item) => [item.ingredient.name.toLowerCase(), item.quantity])
    );

    // Check for missing ingredients
    for (const ingredient of requiredIngredients) {
      const quantity = inventoryMap.get(ingredient.toLowerCase()) ?? 0;
      if (quantity < 1) {
        return NextResponse.json({ error: `Missing ingredient: ${ingredient}` }, { status: 400 });
      }
    }

    // Create a transaction to decrement inventory and record coffee
    await prisma.$transaction([
      ...requiredIngredients.map((ingredient) => {
        const ingredientId = nameToIdMap[ingredient.toLowerCase()];
        if (!ingredientId) {
          throw new Error(`Ingredient ID not found for: ${ingredient}`);
        }

        return prisma.inventory.update({
          where: {
            userId_ingredientId: {
              userId,
              ingredientId,
            },
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });
      }),
      prisma.coffee.create({
        data: {
          userId,
          type,
        },
      }),
    ]);

    return NextResponse.json({ message: `${type} created successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error creating coffee:', error);
    return NextResponse.json({ error: 'Failed to create coffee' }, { status: 500 });
  }
}
