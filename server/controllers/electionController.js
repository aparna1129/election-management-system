import * as electionService from '../services/electionService.js';

export async function getAllElections(req, res) {
  try {
    const elections = await electionService.getAllElections();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
}

export async function getElectionById(req, res) {
  try {
    const election = await electionService.getElectionById(req.params.id);
    res.json(election);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch election' });
  }
}

export async function getElectionByType(req, res) {
  try {
    console.log('getElectionByType called with type:', req.params.type);
    const election = await electionService.getElectionByType(req.params.type);
    console.log('Election found:', election);
    res.json(election);
  } catch (error) {
    console.error('Error in getElectionByType:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch election' });
  }
}

export async function createElection(req, res) {
  try {
    const id = await electionService.createElection(req.body);
    res.status(201).json({ message: 'Election created', id });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to create election' });
  }
}

export async function updateElection(req, res) {
  try {
    await electionService.updateElection(req.params.id, req.body);
    res.json({ message: 'Election updated' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to update election' });
  }
}

export async function deleteElection(req, res) {
  try {
    await electionService.deleteElection(req.params.id);
    res.json({ message: 'Election deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to delete election' });
  }
}

export async function getElectionResults(req, res) {
  try {
    const { electionType } = req.params;
    // Map electionType to election_id
    let election_id = 1;
    if (electionType === 'Loksabha') election_id = 2;
    else if (electionType === 'Vidhansabha') election_id = 3;
    // Fetch results from service
    const results = await electionService.getElectionResults(election_id);
    res.status(200).json(results);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch results' });
  }
}
