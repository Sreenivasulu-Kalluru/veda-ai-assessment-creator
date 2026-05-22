import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { addAssignmentJob } from '../services/queueService';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { topic, dueDate, totalQuestions, totalMarks, instructions, questionTypes } = req.body;

    // Basic validation
    if (!dueDate || !totalQuestions || !totalMarks) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a pending assignment record in DB
    const newAssignment = new Assignment({
      topic,
      dueDate,
      totalQuestions,
      totalMarks,
      instructions,
      status: 'pending',
      sections: [],
    });

    const savedAssignment = await newAssignment.save();

    // Add job to background queue
    await addAssignmentJob(savedAssignment._id.toString(), {
      topic,
      totalQuestions,
      totalMarks,
      instructions,
      questionTypes
    });

    return res.status(201).json({ 
      message: 'Assignment generation started',
      assignmentId: savedAssignment._id 
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    return res.status(200).json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    return res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
