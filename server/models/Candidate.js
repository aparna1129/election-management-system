import db from '../config/db.js';

export async function getAllCandidates() {
  const [rows] = await db.query('SELECT * FROM candidates');
  return rows;
}

export async function getCandidatesByElectionType(electionType) {
  const [rows] = await db.query(
    `SELECT c.* FROM candidates c
     JOIN election e ON c.election_id = e.election_id
     WHERE e.election_type = ?`,
    [electionType]
  );
  return rows;
}

export async function getCandidateById(id) {
  const [rows] = await db.query('SELECT * FROM candidates WHERE cand_id = ?', [id]);
  return rows[0];
}

export async function createCandidate(candidate) {
  const { cand_fname, cand_lname, c_gender, c_dob, c_aadhar, c_email, c_contact, c_address, election_id } = candidate;
  const [result] = await db.query(
    `INSERT INTO candidates 
     (cand_fname, cand_lname, c_gender, c_dob, c_aadhar, c_email, c_contact, c_address, election_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cand_fname, cand_lname, c_gender, c_dob, c_aadhar, c_email, c_contact, c_address, election_id]
  );
  return result.insertId;
}

export async function updateCandidate(id, candidate) {
  const { cand_fname, cand_lname, c_gender, c_dob, c_aadhar, c_email, c_contact, c_address, election_id } = candidate;
  await db.query(
    `UPDATE candidates SET
     cand_fname = ?, cand_lname = ?, c_gender = ?, c_dob = ?, c_aadhar = ?, c_email = ?, c_contact = ?, c_address = ?, election_id = ?
     WHERE cand_id = ?`,
    [cand_fname, cand_lname, c_gender, c_dob, c_aadhar, c_email, c_contact, c_address, election_id, id]
  );
}

export async function deleteCandidate(id) {
  const [result] = await db.query('DELETE FROM candidates WHERE cand_id = ?', [id]);
  return result;
}
