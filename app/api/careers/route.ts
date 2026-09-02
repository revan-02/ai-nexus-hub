import { NextRequest, NextResponse } from 'next/server';
import {
  getAllJobPostings,
  submitJobApplication,
  createJobPosting,
  calculateResumeMatchScore,
  getCandidateApplications,
  getJobById
} from '@/services/career-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experience = searchParams.get('experience') || undefined;
    const category = searchParams.get('category') || undefined;
    const workplaceType = searchParams.get('workplaceType') || undefined;
    const search = searchParams.get('search') || undefined;
    const email = searchParams.get('email') || undefined;

    const jobs = await getAllJobPostings({ experience, category, workplaceType, search });
    const applications = await getCandidateApplications(email);

    return NextResponse.json({
      success: true,
      jobs,
      applications,
      totalCount: jobs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'apply';

    if (action === 'apply') {
      const {
        jobId,
        candidateName,
        candidateEmail,
        candidatePhone,
        experienceYears,
        portfolioUrl,
        githubUrl,
        linkedInUrl,
        resumeFileName,
        coverLetter,
        candidateSkills
      } = body;

      if (!jobId || !candidateName || !candidateEmail) {
        return NextResponse.json(
          { success: false, error: 'jobId, candidateName, and candidateEmail are required' },
          { status: 400 }
        );
      }

      const job = await getJobById(jobId);
      if (!job) {
        return NextResponse.json({ success: false, error: 'Job posting not found' }, { status: 404 });
      }

      const matchAnalysis = calculateResumeMatchScore(
        job,
        candidateSkills || ['Python', 'PyTorch', 'FastAPI', 'Git'],
        experienceYears || 1
      );

      const application = await submitJobApplication({
        jobId,
        jobTitle: job.title,
        company: job.company,
        candidateName,
        candidateEmail,
        candidatePhone: candidatePhone || '+91 9876543210',
        experienceYears: experienceYears || 1,
        portfolioUrl: portfolioUrl || 'https://nexus.ai/portfolio',
        githubUrl: githubUrl || 'https://github.com/developer',
        linkedInUrl: linkedInUrl || 'https://linkedin.com/in/developer',
        resumeFileName: resumeFileName || 'AI_Engineer_Resume.pdf',
        coverLetter: coverLetter || 'Excited to apply for this AI engineering opening!',
        matchScore: matchAnalysis.matchScore,
      });

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully!',
        application,
        matchAnalysis,
      });
    }

    if (action === 'post_job') {
      const newJob = await createJobPosting(body.jobData);
      return NextResponse.json({
        success: true,
        message: 'Job posting published successfully!',
        job: newJob,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process job request' },
      { status: 500 }
    );
  }
}
