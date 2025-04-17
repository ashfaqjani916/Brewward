import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

interface MakeCoffeeRequestBody {
  type: 'Latte' | 'Mocha' | 'IcedCoffee';
}

const coffeeRecipes: Record<string, string[]> = {
  Latte: ['milk', 'coffee', 'sugar'],
  Mocha: ['milk', 'coffee', 'chocochips', 'sugar'],
  IcedCoffee: ['ice', 'coffee', 'milk', 'sugar'],
};

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { phoneNumber: string; userId: number };
    const body: MakeCoffeeRequestBody = await req.json();
    const { type } = body;

    if (!coffeeRecipes[type]) {
      return NextResponse.json({ error: 'Invalid coffee type' }, { status: 400 });
    }

    // Check if user has required ingredients
    const userInventory = await prisma.inventory.findMany({
      where: { userId: decoded.userId },
      include: { ingredient: true },
    });

    const inventoryMap = new Map(userInventory.map((item) => [item.ingredient.name, item.quantity]));
    const requiredIngredients = coffeeRecipes[type];

    for (const ingredient of requiredIngredients) {
      if (!inventoryMap.has(ingredient) || inventoryMap.get(ingredient)! < 1) {
        return NextResponse.json({ error: `Missing ingredient: ${ingredient}` }, { status: 400 });
      }
    }

    // Get all ingredient IDs first
    const ingredients = await prisma.ingredient.findMany({
      where: {
        name: {
          in: requiredIngredients
        }
      }
    });

    const ingredientMap = new Map(ingredients.map(ing => [ing.name, ing.id]));

    // Deduct ingredients and create coffee
    await prisma.$transaction([
      ...requiredIngredients.map((ingredient) =>
        prisma.inventory.update({
          where: {
            userId_ingredientId: {
              userId: decoded.userId,
              ingredientId: ingredientMap.get(ingredient)!,
            },
          },
          data: { quantity: { decrement: 1 } },
        })
      ),
      prisma.coffee.create({
        data: {
          userId: decoded.userId,
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
