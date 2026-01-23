import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { functions } from '@/lib/inngest/functions/video-pipeline';

// Create and export the Inngest handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
