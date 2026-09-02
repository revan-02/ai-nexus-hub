import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { ProjectService } from '@/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await ProjectService.getProjects(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { name, description, category, level, technologies, authorId } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Project name and description are required' }, { status: 400 });
    }

    let targetAuthorId = authorId || session?.user?.id;

    if (!targetAuthorId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return NextResponse.json({ error: 'No user available as author' }, { status: 400 });
      }
      targetAuthorId = firstUser.id;
    }

    const project = await ProjectService.createProject({
      name,
      description,
      category: category || 'AI & ML',
      level: level || 'Intermediate',
      technologies: technologies || ['React', 'TypeScript'],
      authorId: targetAuthorId,
    }, session?.user?.id);

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
