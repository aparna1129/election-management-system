import express from 'express';
import {
  fetchParliamentCandidates,
  fetchCandidateCountPerElection,
  fetchGenderCountForParliament,
  fetchFemaleVotersForCandidate,
  fetchVoteCountForCandidates,
  fetchVoteCountForParliamentCandidates,
  fetchParliamentCandidatesOver50,
  fetchMaleVotersOver50InParliament
} from '../controllers/queriesController.js';

const router = express.Router();

router.get('/1-parliament-candidates', fetchParliamentCandidates);
router.get('/2-candidate-count', fetchCandidateCountPerElection);
router.get('/3-parliament-gender-count', fetchGenderCountForParliament);
router.get('/4-female-voters/:id', fetchFemaleVotersForCandidate);
router.get('/5-votes-per-candidate', fetchVoteCountForCandidates);
router.get('/6-votes-parliament-candidates', fetchVoteCountForParliamentCandidates);
router.get('/7-parliament-candidates-over-50', fetchParliamentCandidatesOver50);
router.get('/8-male-voters-over-50-parliament', fetchMaleVotersOver50InParliament);

export default router;
