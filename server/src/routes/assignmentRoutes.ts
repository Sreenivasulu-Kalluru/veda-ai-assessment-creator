import { Router } from 'express';
import { createAssignment, getAssignment, getAllAssignments, deleteAssignment } from '../controllers/assignmentController';

const router = Router();

router.post('/', createAssignment);
router.get('/:id', getAssignment);
router.get('/', getAllAssignments);
router.delete('/:id', deleteAssignment);

export default router;
