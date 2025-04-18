import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MakeCoffeeRequestBody {
  type: 'Latte' | 'Mocha' | 'IcedCoffee';
}

const coffeeRecipes: Record<string, string[]> = {
  Latte: ['milk', 'coffee', 'sugar'],
  Mocha: ['milk', 'coffee', 'chocochips', 'sugar'],
  IcedCoffee: ['ice', 'coffee', 'milk', 'sugar'],
};

export async function POST(req: NextRequest) {
  try {
    const body: MakeCoffeeRequestBody = await req.json();
    const { type } = body;
    const userId = 1; // Hardcode userId to 1

    if (!coffeeRecipes[type]) {
      return NextResponse.json({ error: 'Invalid coffee type' }, { status: 400 });
    }

    // Check if user has required ingredients
    const userInventory = await prisma.inventory.findMany({
      where: { userId },
      include: { ingredient: true },
    });

    const inventoryMap = new Map<string, number>(userInventory.map((item: { ingredient: { name: string }; quantity: number }) => [item.ingredient.name, item.quantity]));
    const requiredIngredients = coffeeRecipes[type];
    for (const ingredient of requiredIngredients) {
      const quantity = inventoryMap.get(ingredient) ?? 0;
      if (quantity < 1) {
        return NextResponse.json({ error: `Missing ingredient: ${ingredient}` }, { status: 400 });
      }
    }

    // Get all ingredient IDs
    const ingredients = await prisma.ingredient.findMany({
      where: {
        name: {
          in: requiredIngredients,
        },
      },
    });

<<<<<<< HEAD
    const ingredientMap = new Map(ingredients.map((ing: { name: string, id: number }) => [ing.name, ing.id]));
=======
    const ingredientMap = new Map(ingredients.map((ing) => [ing.name, ing.id]));
>>>>>>> ae3885e3161837875febc9e78969f67c3bd423c4

    // Deduct ingredients and create coffee
    await prisma.$transaction([
      ...requiredIngredients.map((ingredient) =>
        prisma.inventory.update({
          where: {
            userId_ingredientId: {
              userId,
              ingredientId: ingredientMap.get(ingredient)!,
            },
          },
          data: { quantity: { decrement: 1 } },
        })
      ),
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
