import * as votesService from '../services/votesService.js';

export async function getAllVotes(req, res) {
  try {
    const votes = await votesService.getAllVotes();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
}

export async function getVoteById(req, res) {
  try {
    const vote = await votesService.getVoteById(req.params.id);
    res.json(vote);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch vote' });
  }
}

export async function checkUserVoteStatus(req, res) {
  try {
    const { voterId, electionId } = req.params;
    const hasVoted = await votesService.checkUserVoteStatus(voterId, electionId);
    res.json({ hasVoted });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to check vote status' });
  }
}

export async function getUserVotingHistory(req, res) {
  try {
    const { voterId } = req.params;
    const votingHistory = await votesService.getUserVotingHistory(voterId);
    res.json(votingHistory);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch voting history' });
  }
}

export async function createVote(req, res) {
  try {
    console.log('createVote called with data:', req.body);
    const id = await votesService.createVote(req.body);
    console.log('Vote created with ID:', id);
    res.status(201).json({ message: 'Vote created', id });
  } catch (error) {
    console.error('Error in createVote:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to create vote' });
  }
}

export async function updateVote(req, res) {
  try {
    await votesService.updateVote(req.params.id, req.body);
    res.json({ message: 'Vote updated' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to update vote' });
  }
}

export async function deleteVote(req, res) {
  try {
    await votesService.deleteVote(req.params.id);
    res.json({ message: 'Vote deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to delete vote' });
  }
}
