import * as Votes from '../models/Votes.js';

function validateVoteInput(data) {
  const requiredFields = ['voter_id', 'cand_id', 'election_id'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error('Invalid vote data');
    }
  }
}

export async function getAllVotes() {
  return await Votes.getAllVotes();
}

export async function getVoteById(id) {
  const vote = await Votes.getVoteById(id);
  if (!vote) {
    throw new Error('Vote not found');
  }
  return vote;
}

export async function checkUserVoteStatus(voterId, electionId) {
  const vote = await Votes.checkUserVoteStatus(voterId, electionId);
  return !!vote; // Return true if vote exists, false otherwise
}

export async function getUserVotingHistory(voterId) {
  return await Votes.getUserVotingHistory(voterId);
}

export async function createVote(data) {
  validateVoteInput(data);
  const result = await Votes.createVote(data);
  return { message: 'Vote created', id: result.insertId };
}

export async function updateVote(id, data) {
  validateVoteInput(data);
  const existing = await Votes.getVoteById(id);
  if (!existing) {
    throw new Error('Vote not found');
  }
  await Votes.updateVote(id, data);
  return { message: 'Vote updated' };
}

export async function deleteVote(id) {
  const existing = await Votes.getVoteById(id);
  if (!existing) {
    throw new Error('Vote not found');
  }

  const result = await Votes.deleteVote(id);
  if (!result || result.affectedRows === 0) {
    throw new Error('Vote not found');
  }

  return { message: 'Vote deleted' };
}

