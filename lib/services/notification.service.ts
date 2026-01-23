import { Resend } from 'resend';
import { prisma } from '@/lib/db';

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export const notificationService = {
  /**
   * Send approval request email
   */
  async sendApprovalEmail(
    projectId: string,
    approvalToken: string,
    projectName: string
  ): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const approvalUrl = `${baseUrl}/approve/${approvalToken}`;

    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
      console.warn('[Notification] NOTIFICATION_EMAIL not set, skipping email');
      return;
    }

    // Get script details
    const script = await prisma.script.findUnique({
      where: { projectId },
    });

    try {
      await getResend().emails.send({
        from: 'ORION <noreply@orion.video>',
        to: notificationEmail,
        subject: `[Aprovação Necessária] Roteiro: ${projectName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Aprovação de Roteiro</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fafafa; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background: #18181b; border-radius: 16px; padding: 32px; border: 1px solid #27272a;">
              <h1 style="color: #fafafa; margin-bottom: 8px;">🎬 Novo Roteiro Pronto</h1>
              <h2 style="color: #a1a1aa; font-weight: normal; margin-top: 0;">${projectName}</h2>

              ${script?.title ? `
              <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h3 style="color: #fafafa; margin-top: 0;">Título do Vídeo:</h3>
                <p style="color: #e4e4e7; font-size: 18px;">${script.title}</p>
              </div>
              ` : ''}

              <p style="color: #a1a1aa; line-height: 1.6;">
                O roteiro foi gerado e está aguardando sua aprovação.
                Clique no botão abaixo para revisar e aprovar.
              </p>

              <a href="${approvalUrl}"
                 style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                        color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px;
                        font-weight: 600; margin: 24px 0;">
                Revisar Roteiro →
              </a>

              <p style="color: #71717a; font-size: 12px; margin-top: 32px;">
                Este link expira em 7 dias.<br>
                Se você não solicitou este email, ignore-o.
              </p>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`[Notification] Approval email sent for project ${projectId}`);
    } catch (error) {
      console.error('[Notification] Failed to send approval email:', error);
      throw error;
    }
  },

  /**
   * Send completion notification
   */
  async sendCompletionEmail(projectId: string, youtubeUrl: string): Promise<void> {
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
      console.warn('[Notification] NOTIFICATION_EMAIL not set, skipping email');
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { script: true },
    });

    try {
      await getResend().emails.send({
        from: 'ORION <noreply@orion.video>',
        to: notificationEmail,
        subject: `✅ Vídeo Publicado: ${project?.name || 'Projeto'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Vídeo Publicado</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fafafa; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background: #18181b; border-radius: 16px; padding: 32px; border: 1px solid #27272a;">
              <h1 style="color: #22c55e; margin-bottom: 8px;">✅ Vídeo Publicado!</h1>
              <h2 style="color: #fafafa; font-weight: normal; margin-top: 0;">${project?.script?.title || project?.name}</h2>

              <p style="color: #a1a1aa; line-height: 1.6;">
                Seu vídeo foi renderizado e publicado no YouTube com sucesso!
              </p>

              <a href="${youtubeUrl}"
                 style="display: inline-block; background: #ef4444;
                        color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px;
                        font-weight: 600; margin: 24px 0;">
                ▶️ Ver no YouTube
              </a>

              <p style="color: #71717a; font-size: 12px; margin-top: 32px;">
                ORION - Produção Automatizada de Vídeos
              </p>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`[Notification] Completion email sent for project ${projectId}`);
    } catch (error) {
      console.error('[Notification] Failed to send completion email:', error);
      // Don't throw - completion email is not critical
    }
  },
};
