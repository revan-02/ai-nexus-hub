import { NextRequest, NextResponse } from 'next/server';
import { ContentService } from '@/services';
import { createContentSchema } from '@/schemas/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await ContentService.getContents(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createContentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 });
    }

    const content = await ContentService.createContent(validation.data);
    return NextResponse.json({ data: content }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

