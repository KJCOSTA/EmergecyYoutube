import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { inngest } from '@/lib/inngest/client';

/**
 * POST /api/approve
 * Approve a pending script via token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, action, feedback } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find workflow state by token
    const workflowState = await prisma.workflowState.findUnique({
      where: { approvalToken: token },
      include: {
        project: {
          include: { script: true },
        },
      },
    });

    if (!workflowState) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    if (workflowState.project.status !== 'AWAITING_APPROVAL') {
      return NextResponse.json(
        { error: 'Project is not awaiting approval' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Update project status
      await prisma.project.update({
        where: { id: workflowState.projectId },
        data: { status: 'APPROVED' },
      });

      // Update script as approved
      await prisma.script.update({
        where: { projectId: workflowState.projectId },
        data: {
          approved: true,
          approvedAt: new Date(),
        },
      });

      // Send approval event to Inngest to continue workflow
      await inngest.send({
        name: 'project/approved',
        data: {
          projectId: workflowState.projectId,
          feedback: feedback || undefined,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Script approved successfully',
        projectId: workflowState.projectId,
      });
    } else if (action === 'request_changes') {
      // Update script with feedback
      await prisma.script.update({
        where: { projectId: workflowState.projectId },
        data: {
          feedback: feedback || 'Changes requested',
        },
      });

      // Update workflow state
      await prisma.workflowState.update({
        where: { projectId: workflowState.projectId },
        data: {
          currentStep: 'script_revision',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Feedback submitted for revision',
        projectId: workflowState.projectId,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Approve API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/approve?token=xxx
 * Get project details for approval page
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const workflowState = await prisma.workflowState.findUnique({
      where: { approvalToken: token },
      include: {
        project: {
          include: {
            script: true,
            research: true,
          },
        },
      },
    });

    if (!workflowState) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      project: {
        id: workflowState.project.id,
        name: workflowState.project.name,
        topic: workflowState.project.topic,
        status: workflowState.project.status,
      },
      script: workflowState.project.script
        ? {
            title: workflowState.project.script.title,
            content: workflowState.project.script.content,
            sections: workflowState.project.script.sections,
          }
        : null,
      research: workflowState.project.research
        ? {
            summary: workflowState.project.research.summary,
          }
        : null,
      workflow: {
        currentStep: workflowState.currentStep,
        approvalSentAt: workflowState.approvalSentAt,
      },
    });
  } catch (error) {
    console.error('[Approve API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
