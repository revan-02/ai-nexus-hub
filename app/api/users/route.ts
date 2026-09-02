import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services';
import { createUserSchema } from '@/schemas/user';

// GET /api/users — List users with pagination, search, filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await UserService.getUsers(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/users — Create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 });
    }

    const user = await UserService.createUser(validation.data);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

