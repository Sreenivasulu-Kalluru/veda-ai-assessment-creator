import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { Assignment } from '../models/Assignment';
import { generateQuestionPaper } from './aiService';
import { getIO } from '../utils/socket';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const assignmentQueue = new Queue('assignment-generation', {
  connection,
});

export const addAssignmentJob = async (assignmentId: string, promptData: any) => {
  await assignmentQueue.add('generate', { assignmentId, promptData });
};

// Worker to process the AI generation jobs
const worker = new Worker('assignment-generation', async (job: Job) => {
  const { assignmentId, promptData } = job.data;
  
  try {
    console.log(`Processing job for assignment: ${assignmentId}`);
    
    // Update status to processing
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    
    // Notify client that processing started
    const io = getIO();
    io.to(assignmentId).emit('assignment_status', { status: 'processing', assignmentId });

    // Call the AI Service
    const generatedData = await generateQuestionPaper(promptData);
    
    // Save generated sections to DB
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { 
        status: 'completed', 
        sections: generatedData.sections 
      },
      { new: true }
    );

    // Notify client of completion
    io.to(assignmentId).emit('assignment_completed', updatedAssignment);
    console.log(`Job completed for assignment: ${assignmentId}`);
    
  } catch (error) {
    console.error(`Job failed for assignment ${assignmentId}:`, error);
    
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    
    const io = getIO();
    io.to(assignmentId).emit('assignment_failed', { assignmentId, error: error instanceof Error ? error.message : 'Failed to generate assignment' });
    
    throw error;
  }
}, { connection });

worker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.error(`Job ${job.id} failed with error ${err.message}`);
  }
});
