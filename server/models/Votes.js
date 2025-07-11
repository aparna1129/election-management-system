import db from '../config/db.js';

export async function getAllVotes() {
  const [rows] = await db.query('SELECT * FROM votes');
  return rows;
}

export async function getVoteById(id) {
  const [rows] = await db.query('SELECT * FROM votes WHERE votes_id = ?', [id]);
  return rows[0];
}

export async function checkUserVoteStatus(voterId, electionId) {
  const [rows] = await db.query(
    'SELECT * FROM votes WHERE voter_id = ? AND election_id = ?',
    [voterId, electionId]
  );
  return rows[0]; // Return the vote if exists, null if not
}

export async function getUserVotingHistory(voterId) {
  const [rows] = await db.query(`
    SELECT 
      v.votes_id,
      v.election_id,
      e.election_type,
      c.cand_id,
      c.cand_fname,
      c.cand_lname,
      c.c_gender,
      c.c_dob,
      c.c_aadhar,
      c.c_email,
      c.c_contact
    FROM votes v
    JOIN election e ON v.election_id = e.election_id
    JOIN candidates c ON v.cand_id = c.cand_id
    WHERE v.voter_id = ?
    ORDER BY v.votes_id DESC
  `, [voterId]);
  return rows;
}

export async function createVote(vote) {
  const voter_id = vote.voter_id;
  const cand_id = vote.cand_id;
  const election_id = vote.election_id;

  const [result] = await db.query(
    'INSERT INTO votes (voter_id, cand_id, election_id) VALUES (?, ?, ?)',
    [ voter_id, cand_id, election_id ]
  );
  return result;
}

export async function updateVote(id, vote) {
  const voter_id = vote.voter_id;
  const cand_id = vote.cand_id;
  const election_id = vote.election_id;

  const [result] = await db.query(
    'UPDATE votes SET voter_id = ?, cand_id = ?, election_id = ? WHERE votes_id = ?',
    [ voter_id, cand_id, election_id, id ]
  );
  return result;
}

export async function deleteVote(id) {
  const [result] = await db.query('DELETE FROM votes WHERE votes_id = ?', [id]);
  return result;
}
