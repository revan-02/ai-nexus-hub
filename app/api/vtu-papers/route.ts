import { NextRequest, NextResponse } from 'next/server';
import { getVTUQuestionPapers, getVTUPaperById } from '@/services/vtu-question-paper-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const paper = await getVTUPaperById(id);
      if (!paper) {
        return NextResponse.json({ success: false, error: 'Question paper not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, paper });
    }

    const branch = searchParams.get('branch') || undefined;
    const subjectCode = searchParams.get('subjectCode') || undefined;
    const scheme = searchParams.get('scheme') || undefined;
    const semester = searchParams.get('semester') || undefined;
    const search = searchParams.get('search') || undefined;

    const papers = await getVTUQuestionPapers({ branch, subjectCode, scheme, semester, search });

    return NextResponse.json({
      success: true,
      papers,
      totalCount: papers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch VTU question papers' },
      { status: 500 }
    );
  }
}
