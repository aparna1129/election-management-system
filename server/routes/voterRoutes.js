import express from 'express';
import {
  getAllVoters,
  getVoterById,
  getVoterByEmail,
  createVoter,
  updateVoter,
  updateVoterByEmail,
  deleteVoter,
  testDatabase
} from '../controllers/voterController.js';
import { authenticateToken } from '../services/authService.js';

const router = express.Router();

router.get('/test', testDatabase);
router.get('/', getAllVoters);
router.get('/me', authenticateToken, getVoterByEmail);
router.get('/:id', getVoterById);
router.post('/', createVoter);
router.put('/me', authenticateToken, updateVoterByEmail);
router.put('/:id', updateVoter);
router.delete('/:id', deleteVoter);

export default router;
