import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

// GET athletes
export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      take: 25,
      orderBy: { name: 'asc' }
    });
    return json(athletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return json({ error: 'Failed to fetch athletes' }, { status: 500 });
  }
}

// POST new athlete
export async function POST({ request }) {
  try {
    const body = await request.json();
    
    if (!body || !body.name) {
      return json({ error: 'Name is required' }, { status: 400 });
    }
    
    const athlete = await prisma.athlete.create({
      data: {
        name: body.name,
        position: body.position || null,
        number: body.number || null,
        lastPlay: body.lastPlay || null
      }
    });
    
    return json(athlete, { status: 201 });
  } catch (error) {
    console.error('Error creating athlete:', error);
    return json({ error: 'Failed to create athlete' }, { status: 500 });
  }
}