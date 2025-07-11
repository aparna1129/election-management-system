import * as candidateService from '../services/candidateService.js';

import * as Candidate from '../models/Candidate.js';

export async function getAllCandidates(req, res) {
  try {
    const { electionType } = req.query;

    let candidates;
    if (electionType) {
      candidates = await Candidate.getCandidatesByElectionType(electionType);
    } else {
      candidates = await Candidate.getAllCandidates();
    }

    // Format c_dob as 'YYYY-MM-DD' for each candidate
    candidates = candidates.map(c => ({
      ...c,
      c_dob: c.c_dob instanceof Date
        ? c.c_dob.toISOString().slice(0, 10)
        : (typeof c.c_dob === 'string' && c.c_dob.length > 10 ? c.c_dob.slice(0, 10) : c.c_dob)
    }));

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}


export async function getCandidateById(req, res) {
  try {
    const candidate = await candidateService.getCandidateById(req.params.id);
    res.json(candidate);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch candidate' });
  }
}

export async function createCandidate(req, res) {
  try {
    const id = await candidateService.createCandidate(req.body);
    res.status(201).json({ message: 'Candidate created', id });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to create candidate' });
  }
}

export async function updateCandidate(req, res) {
  try {
    await candidateService.updateCandidate(req.params.id, req.body);
    res.json({ message: 'Candidate updated' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to update candidate' });
  }
}

export async function deleteCandidate(req, res) {
  try {
    await candidateService.deleteCandidate(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to delete candidate' });
  }
}
