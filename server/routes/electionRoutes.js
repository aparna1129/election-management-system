import express from 'express';
import {
  getAllElections,
  getElectionById,
  getElectionByType,
  createElection,
  updateElection,
  deleteElection,
  getElectionResults
} from '../controllers/electionController.js';

const router = express.Router();

router.get('/', getAllElections);
router.get('/type/:type', getElectionByType);
router.get('/:id', getElectionById);
router.post('/', createElection);
router.put('/:id', updateElection);
router.delete('/:id', deleteElection);
router.get('/results/:electionType', getElectionResults);

export default router;
