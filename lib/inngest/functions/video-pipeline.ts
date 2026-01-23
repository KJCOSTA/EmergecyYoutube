import { inngest } from '../client';
import { prisma } from '@/lib/db';
import { researchService } from '@/lib/services/research.service';
import { scriptService } from '@/lib/services/script.service';
import { storyboardService } from '@/lib/services/storyboard.service';
import { renderService } from '@/lib/services/render.service';
import { uploadService } from '@/lib/services/upload.service';
import { notificationService } from '@/lib/services/notification.service';
import crypto from 'crypto';

/**
 * Main Video Production Pipeline
 *
 * This workflow orchestrates the entire video production process:
 * 1. Deep Research (Gemini) - Analyzes trends and channel data
 * 2. Script Generation (Claude) - Creates optimized script
 * 3. Human Approval - Waits for user approval via email
 * 4. Storyboard Generation - Creates visual scene descriptions
 * 5. Video Rendering (JSON2VIDEO) - Renders the final video
 * 6. YouTube Upload - Publishes with automatic retries
 */
export const videoPipeline = inngest.createFunction(
  {
    id: 'video-production-pipeline',
    name: 'Video Production Pipeline',
    retries: 3,
  },
  { event: 'project/start' },
  async ({ event, step }) => {
    const { projectId, topic, autoMode } = event.data;

    // Initialize workflow state
    await step.run('init-workflow', async () => {
      await prisma.workflowState.upsert({
        where: { projectId },
        create: {
          projectId,
          currentStep: 'research',
          approvalToken: crypto.randomBytes(32).toString('hex'),
        },
        update: {
          currentStep: 'research',
          error: null,
        },
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'RESEARCHING' },
      });
    });

    // Step 1: Deep Research with Gemini
    const researchResult = await step.run('deep-research', async () => {
      await prisma.workflowState.update({
        where: { projectId },
        data: { researchStartedAt: new Date() },
      });

      const result = await researchService.execute(projectId, topic);

      await prisma.workflowState.update({
        where: { projectId },
        data: { researchCompletedAt: new Date() },
      });

      return result;
    });

    // Step 2: Script Generation with Claude
    await step.run('update-status-scripting', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'SCRIPTING' },
      });
      await prisma.workflowState.update({
        where: { projectId },
        data: {
          currentStep: 'script',
          scriptStartedAt: new Date(),
        },
      });
    });

    const scriptResult = await step.run('generate-script', async () => {
      const result = await scriptService.generate(projectId, topic, researchResult);

      await prisma.workflowState.update({
        where: { projectId },
        data: { scriptCompletedAt: new Date() },
      });

      return result;
    });

    // Step 3: Human Approval (skip if autoMode)
    if (!autoMode) {
      await step.run('send-approval-request', async () => {
        const workflowState = await prisma.workflowState.findUnique({
          where: { projectId },
        });

        if (workflowState?.approvalToken) {
          const project = await prisma.project.findUnique({
            where: { id: projectId },
          });

          await notificationService.sendApprovalEmail(
            projectId,
            workflowState.approvalToken,
            project?.name || topic
          );

          await prisma.project.update({
            where: { id: projectId },
            data: { status: 'AWAITING_APPROVAL' },
          });

          await prisma.workflowState.update({
            where: { projectId },
            data: {
              currentStep: 'approval',
              approvalSentAt: new Date(),
            },
          });
        }
      });

      // Wait for approval event (max 7 days)
      const approval = await step.waitForEvent('wait-for-approval', {
        event: 'project/approved',
        timeout: '7d',
        match: 'data.projectId',
      });

      if (!approval) {
        throw new Error('Approval timeout - project expired after 7 days');
      }
    }

    // Step 4: Generate Storyboard
    await step.run('update-status-storyboard', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'STORYBOARDING' },
      });
      await prisma.workflowState.update({
        where: { projectId },
        data: {
          currentStep: 'storyboard',
          approvedAt: new Date(),
          storyboardStartedAt: new Date(),
        },
      });
    });

    const storyboardResult = await step.run('generate-storyboard', async () => {
      const result = await storyboardService.generate(projectId, scriptResult);

      await prisma.workflowState.update({
        where: { projectId },
        data: { storyboardCompletedAt: new Date() },
      });

      return result;
    });

    // Step 5: Render Video
    await step.run('update-status-rendering', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'RENDERING' },
      });
      await prisma.workflowState.update({
        where: { projectId },
        data: {
          currentStep: 'render',
          renderStartedAt: new Date(),
        },
      });
    });

    const renderResult = await step.run('submit-render-job', async () => {
      return await renderService.submit(projectId, storyboardResult);
    });

    // Poll for render completion
    await step.run('wait-for-render', async () => {
      let completed = false;
      let attempts = 0;
      const maxAttempts = 60; // 30 minutes max (30s intervals)

      while (!completed && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        const status = await renderService.checkStatus(projectId, renderResult.externalJobId);

        if (status.completed) {
          completed = true;
          await prisma.workflowState.update({
            where: { projectId },
            data: { renderCompletedAt: new Date() },
          });
        } else if (status.failed) {
          throw new Error(`Render failed: ${status.error}`);
        }

        attempts++;
      }

      if (!completed) {
        throw new Error('Render timeout after 30 minutes');
      }
    });

    // Step 6: Upload to YouTube
    await step.run('update-status-uploading', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'UPLOADING' },
      });
      await prisma.workflowState.update({
        where: { projectId },
        data: {
          currentStep: 'upload',
          uploadStartedAt: new Date(),
        },
      });
    });

    const render = await prisma.render.findUnique({ where: { projectId } });

    const uploadResult = await step.run('upload-to-youtube', async () => {
      return await uploadService.upload(projectId, {
        videoUrl: render?.videoUrl || undefined,
        thumbnailUrl: render?.thumbnailUrl || undefined,
        duration: render?.duration || undefined,
      });
    });

    // Final: Mark as completed
    await step.run('complete-workflow', async () => {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'COMPLETED' },
      });
      await prisma.workflowState.update({
        where: { projectId },
        data: {
          currentStep: 'completed',
          uploadCompletedAt: new Date(),
        },
      });

      // Send completion notification
      await notificationService.sendCompletionEmail(
        projectId,
        uploadResult.youtubeUrl
      );
    });

    return {
      success: true,
      projectId,
      youtubeUrl: uploadResult.youtubeUrl,
    };
  }
);

// Export all functions
export const functions = [videoPipeline];
