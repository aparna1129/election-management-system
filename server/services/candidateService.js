import * as Candidate from '../models/Candidate.js';

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

function validateCandidateInput(candidate) {
  const requiredFields = [
    'cand_fname',
    'cand_lname',
    'c_gender',
    'c_dob',
    'c_aadhar',
    'c_email',
    'c_contact',
    'c_address',
    'election_id'
  ];

  for (const field of requiredFields) {
    if (!candidate[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Age validation
  const age = calculateAge(candidate.c_dob);
  if (age < 18) {
    throw new Error('Candidates must be 18 years or older to register');
  }
}

export async function getAllCandidates() {
  return await Candidate.getAllCandidates();
}

export async function getCandidatesByElectionType(electionType) {
  if (!electionType) {
    throw new Error('Election type is required');
  }
  return await Candidate.getCandidatesByElectionType(electionType);
}

export async function getCandidateById(id) {
  const candidate = await Candidate.getCandidateById(id);
  if (!candidate) {
    throw new Error('Candidate not found');
  }
  return candidate;
}

export async function createCandidate(data) {
  validateCandidateInput(data);
  const insertId = await Candidate.createCandidate(data);
  return { message: 'Candidate created', id: insertId };
}

export async function updateCandidate(id, data) {
  validateCandidateInput(data);
  const existing = await Candidate.getCandidateById(id);
  if (!existing) {
    throw new Error('Candidate not found');
  }
  await Candidate.updateCandidate(id, data);
  return { message: 'Candidate updated' };
}

export async function deleteCandidate(id) {
  const existing = await Candidate.getCandidateById(id);
  if (!existing) {
    throw new Error('Candidate not found');
  }
  await Candidate.deleteCandidate(id);
  return { message: 'Candidate deleted' };
}