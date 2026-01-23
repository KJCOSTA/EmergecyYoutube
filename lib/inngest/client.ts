import { Inngest } from 'inngest';

// Create the Inngest client
export const inngest = new Inngest({
  id: 'orion-video-pipeline',
  name: 'ORION Video Production',
});

// Event types for type safety
export type OrionEvents = {
  'project/start': {
    data: {
      projectId: string;
      topic: string;
      autoMode: boolean;
    };
  };
  'project/approved': {
    data: {
      projectId: string;
      feedback?: string;
    };
  };
  'project/rejected': {
    data: {
      projectId: string;
      feedback: string;
    };
  };
};
