import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CATEGORIES, ParentCategory, ChildCategory } from '@/lib/mock-data/categories-data';

let categoriesStore: ParentCategory[] = [...MOCK_CATEGORIES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();

    let result = [...categoriesStore];

    if (search) {
      result = result
        .map((cat) => {
          const matchesParent =
            cat.name.toLowerCase().includes(search) ||
            cat.slug.toLowerCase().includes(search) ||
            cat.description.toLowerCase().includes(search);

          const matchingChildren = cat.children.filter(
            (child) =>
              child.name.toLowerCase().includes(search) ||
              child.slug.toLowerCase().includes(search) ||
              child.description.toLowerCase().includes(search)
          );

          if (matchesParent || matchingChildren.length > 0) {
            return {
              ...cat,
              children: matchingChildren.length > 0 ? matchingChildren : cat.children,
            };
          }
          return null;
        })
        .filter(Boolean) as ParentCategory[];
    }

    const totalParentCount = categoriesStore.length;
    const totalChildCount = categoriesStore.reduce((sum, c) => sum + c.children.length, 0);

    return NextResponse.json({
      success: true,
      data: {
        categories: result,
        totalParentCount,
        totalChildCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, parentId, color, icon } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Case 1: Creating a Child Category
    if (parentId) {
      const parentIndex = categoriesStore.findIndex((c) => c.id === parentId);
      if (parentIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Specified parent category does not exist' },
          { status: 404 }
        );
      }

      const newChild: ChildCategory = {
        id: `sub-${Date.now()}`,
        name,
        slug: generatedSlug,
        description: description || `Sub-category under ${categoriesStore[parentIndex].name}`,
        parentId,
        parentName: categoriesStore[parentIndex].name,
        courseCount: 0,
        articleCount: 0,
        icon: icon || 'Tag',
        color: color || categoriesStore[parentIndex].color || '#8b5cf6',
        status: 'Active',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };

      categoriesStore[parentIndex] = {
        ...categoriesStore[parentIndex],
        children: [...categoriesStore[parentIndex].children, newChild],
      };

      return NextResponse.json({
        success: true,
        message: `Child category "${name}" created under "${categoriesStore[parentIndex].name}"`,
        data: newChild,
      });
    }

    // Case 2: Creating a Parent Category
    const newParent: ParentCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug: generatedSlug,
      description: description || 'Platform main category domain',
      icon: icon || 'FolderTree',
      color: color || '#8b5cf6',
      courseCount: 0,
      articleCount: 0,
      status: 'Active',
      children: [],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    categoriesStore = [newParent, ...categoriesStore];

    return NextResponse.json({
      success: true,
      message: `Parent category "${name}" created successfully`,
      data: newParent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    // Check if it's a parent category
    const parentIndex = categoriesStore.findIndex((c) => c.id === id);
    if (parentIndex !== -1) {
      const removed = categoriesStore[parentIndex];
      categoriesStore = categoriesStore.filter((c) => c.id !== id);
      return NextResponse.json({
        success: true,
        message: `Parent category "${removed.name}" and its sub-categories were deleted`,
      });
    }

    // Check if it's a child category
    for (let i = 0; i < categoriesStore.length; i++) {
      const childIndex = categoriesStore[i].children.findIndex((c) => c.id === id);
      if (childIndex !== -1) {
        const removedChild = categoriesStore[i].children[childIndex];
        categoriesStore[i].children = categoriesStore[i].children.filter((c) => c.id !== id);
        return NextResponse.json({
          success: true,
          message: `Child category "${removedChild.name}" deleted from "${categoriesStore[i].name}"`,
        });
      }
    }

    return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
