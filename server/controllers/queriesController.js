import * as queriesService from '../services/queriesService.js';

export async function fetchParliamentCandidates(req, res) {
  try {
    const data = await queriesService.fetchParliamentCandidates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parliament candidates' });
  }
}

export async function fetchCandidateCountPerElection(req, res) {
  try {
    const data = await queriesService.fetchCandidateCountPerElection();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidate count per election' });
  }
}

export async function fetchGenderCountForParliament(req, res) {
  try {
    const data = await queriesService.fetchGenderCountForParliament();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gender count' });
  }
}

export async function fetchFemaleVotersForCandidate(req, res) {
  try {
    const data = await queriesService.fetchFemaleVotersForCandidate(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch female voters' });
  }
}

export async function fetchVoteCountForCandidates(req, res) {
  try {
    const data = await queriesService.fetchVoteCountForCandidates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vote count' });
  }
}

export async function fetchVoteCountForParliamentCandidates(req, res) {
  try {
    const data = await queriesService.fetchVoteCountForParliamentCandidates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parliament candidate votes' });
  }
}

export async function fetchParliamentCandidatesOver50(req, res) {
  try {
    const data = await queriesService.fetchParliamentCandidatesOver50();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parliament candidates over 50' });
  }
}

export async function fetchMaleVotersOver50InParliament(req, res) {
  try {
    const data = await queriesService.fetchMaleVotersOver50InParliament();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch male voters over 50 in parliament' });
  }
}
