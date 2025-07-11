import * as Queries from '../models/Queries.js';

export async function fetchParliamentCandidates() {
  return await Queries.getParliamentCandidates();
}

export async function fetchCandidateCountPerElection() {
  return await Queries.getCandidateCountPerElection();
}

export async function fetchGenderCountForParliament() {
  return await Queries.getGenderCountForParliament();
}

export async function fetchFemaleVotersForCandidate(candId) {
  if (!candId) {
    throw { status: 400, message: 'Candidate ID is required' };
  }
  return await Queries.getFemaleVotersForCandidate(candId);
}

export async function fetchVoteCountForCandidates() {
  return await Queries.getVoteCountForCandidates();
}

export async function fetchVoteCountForParliamentCandidates() {
  return await Queries.getVoteCountForParliamentCandidates();
}

export async function fetchParliamentCandidatesOver50() {
  return await Queries.getParliamentCandidatesOver50();
}

export async function fetchMaleVotersOver50InParliament() {
  return await Queries.getMaleVotersOver50InParliament();
}
