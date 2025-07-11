import db from '../config/db.js';

export async function getAllElections() {
  const [rows] = await db.query('SELECT * FROM election');
  return rows;
}

export async function getElectionById(id) {
  const [rows] = await db.query('SELECT * FROM election WHERE election_id = ?', [id]);
  return rows[0];
}

export async function getElectionByType(type) {
  const [rows] = await db.query('SELECT * FROM election WHERE election_type = ?', [type]);
  return rows[0];
}

export async function createElection(election) {
  const election_type = election.election_type;

  const [result] = await db.query(
    'INSERT INTO election (election_type) VALUES (?)',
    [election_type]
  );

  return result;
}

export async function updateElection(id, election) {
  const election_type = election.election_type;

  const [result] = await db.query(
    'UPDATE election SET election_type = ? WHERE election_id = ?',
    [
      election_type,
      id
    ]
  );

  return result;
}

export async function deleteElection(id) {
  const [result] = await db.query('DELETE FROM election WHERE election_id = ?', [id]);
  return result;
}