import express from 'express';
import {
  getAllVotes,
  getVoteById,
  createVote,
  updateVote,
  deleteVote,
  checkUserVoteStatus,
  getUserVotingHistory
} from '../controllers/votesController.js';

const router = express.Router();

router.get('/', getAllVotes);
router.get('/check/:voterId/:electionId', checkUserVoteStatus);
router.get('/history/:voterId', getUserVotingHistory);
router.get('/:id', getVoteById);
router.post('/', createVote);
router.put('/:id', updateVote);
router.delete('/:id', deleteVote);

export default router;
