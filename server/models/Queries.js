import db from '../config/db.js';

// 1. Fetch all candidate names standing for parliament election
export const getParliamentCandidates = async () => {
  const [rows] = await db.execute(`
    SELECT cand_fname, cand_lname
    FROM candidates c
    JOIN election e ON c.election_id = e.election_id
    WHERE e.election_type = 'Parliament'
  `);
  return rows;
};

// 2. Fetch count of all candidates standing in each election
export const getCandidateCountPerElection = async () => {
  const [rows] = await db.execute(`
    SELECT e.election_type, COUNT(c.cand_id) AS candidate_count
    FROM candidates c
    JOIN election e ON c.election_id = e.election_id
    GROUP BY e.election_type
  `);
  return rows;
};

// 3. Fetch count of male & female candidates standing for parliament election
export const getGenderCountForParliament = async () => {
  const [rows] = await db.execute(`
    SELECT c.c_gender, COUNT(*) AS count
    FROM candidates c
    JOIN election e ON c.election_id = e.election_id
    WHERE e.election_type = 'Parliament'
    GROUP BY c.c_gender
  `);
  return rows;
};

// 4. Fetch all female voters who voted for a particular candidate
export const getFemaleVotersForCandidate = async (candId) => {
  const [rows] = await db.execute(`
    SELECT v.voter_fname, v.voter_lname, v.v_email
    FROM votes vt
    JOIN voters v ON vt.voter_id = v.voter_id
    WHERE vt.cand_id = ? AND v.v_gender = 'Female'
  `, [candId]);
  return rows;
};

// 5. Fetch total count of votes for each candidate
export const getVoteCountForCandidates = async () => {
  const [rows] = await db.execute(`
    SELECT c.cand_id, c.cand_fname, c.cand_lname, COUNT(v.votes_id) AS total_votes
    FROM candidates c
    LEFT JOIN votes v ON c.cand_id = v.cand_id
    GROUP BY c.cand_id
  `);
  return rows;
};

// 6. Fetch total count of votes for each candidate in parliament election
export const getVoteCountForParliamentCandidates = async () => {
  const [rows] = await db.execute(`
    SELECT c.cand_id, c.cand_fname, c.cand_lname, COUNT(v.votes_id) AS total_votes
    FROM candidates c
    JOIN election e ON c.election_id = e.election_id
    LEFT JOIN votes v ON c.cand_id = v.cand_id
    WHERE e.election_type = 'Parliament'
    GROUP BY c.cand_id
  `);
  return rows;
};

// 7. Fetch all candidates in parliament election whose age > 50
export const getParliamentCandidatesOver50 = async () => {
  const [rows] = await db.execute(`
    SELECT cand_fname, cand_lname, c_dob
    FROM candidates c
    JOIN election e ON c.election_id = e.election_id
    WHERE e.election_type = 'Parliament'
      AND TIMESTAMPDIFF(YEAR, c_dob, CURDATE()) > 50
  `);
  return rows;
};

// 8. Fetch all male voters who voted in parliament election and are age > 50
export const getMaleVotersOver50InParliament = async () => {
  const [rows] = await db.execute(`
    SELECT v.voter_fname, v.voter_lname, v.v_dob
    FROM votes vt
    JOIN voters v ON vt.voter_id = v.voter_id
    JOIN election e ON vt.election_id = e.election_id
    WHERE v.v_gender = 'Male'
      AND e.election_type = 'Parliament'
      AND TIMESTAMPDIFF(YEAR, v.v_dob, CURDATE()) > 50
  `);
  return rows;
};
