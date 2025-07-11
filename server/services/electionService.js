import * as Election from '../models/Election.js';
import db from '../config/db.js';

export async function getAllElections() {
  return await Election.getAllElections();
}

export async function getElectionById(id) {
  const election = await Election.getElectionById(id);
  if (!election) {
    throw new Error('Election not found');
  }
  return election;
}

export async function getElectionByType(type) {
  const election = await Election.getElectionByType(type);
  if (!election) {
    throw new Error('Election not found');
  }
  return election;
}

export async function createElection(data) {
  if (!data.election_type) {
    throw new Error('election_type is required');
  }

  const result = await Election.createElection(data);
  return { message: 'Election created', id: result.insertId };
}

export async function updateElection(id, data) {
  if (!data.election_type) {
    throw new Error('election_type is required');
  }

  const result = await Election.updateElection(id, data);

  if (result.affectedRows === 0) {
    throw new Error('Election not found');
  }

  return { message: 'Election updated' };
}

export async function deleteElection(id) {
  const result = await Election.deleteElection(id);

  if (result.affectedRows === 0) {
    throw new Error('Election not found');
  }

  return { message: 'Election deleted' };
}

export async function getElectionResults(election_id) {
  const [rows] = await db.query(`
    SELECT c.cand_id, c.cand_fname, c.cand_lname, COUNT(v.votes_id) as vote_count
    FROM candidates c
    LEFT JOIN votes v ON c.cand_id = v.cand_id
    WHERE c.election_id = ?
    GROUP BY c.cand_id, c.cand_fname, c.cand_lname
    ORDER BY vote_count DESC
  `, [election_id]);
  return rows;
}