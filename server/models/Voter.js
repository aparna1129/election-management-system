import db from '../config/db.js';

export async function getAllVoters() {
  const [rows] = await db.query('SELECT * FROM voters');
  return rows;
}

export async function getVoterById(id) {
  const [rows] = await db.query('SELECT * FROM voters WHERE id = ?', [id]);
  return rows[0];
}

export async function getVoterByEmail(email) {
  const [rows] = await db.query('SELECT * FROM voters WHERE v_email = ?', [email]);
  return rows[0];
}

export async function createVoter(voter) {
  const { voter_fname, voter_lname, v_gender, v_dob, v_aadhar, v_email, v_contact, v_address } = voter;
  const [result] = await db.query(
    `INSERT INTO voters 
     (voter_fname, voter_lname, v_gender, v_dob, v_aadhar, v_email, v_contact, v_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [voter_fname, voter_lname, v_gender, v_dob, v_aadhar, v_email, v_contact, v_address]
  );
  return result.insertId;
}

export async function updateVoter(id, voter) {
  const { voter_fname, voter_lname, v_gender, v_dob, v_aadhar, v_email, v_contact, v_address } = voter;
  await db.query(
    `UPDATE voters SET 
     voter_fname = ?, voter_lname = ?, v_gender = ?, v_dob = ?, 
     v_aadhar = ?, v_email = ?, v_contact = ?, v_address = ?
     WHERE id = ?`,
    [voter_fname, voter_lname, v_gender, v_dob, v_aadhar, v_email, v_contact, v_address, id]
  );
}

export async function updateVoterByEmail(email, voter) {
  try {
    console.log('updateVoterByEmail model called');
    console.log('Email:', email);
    console.log('Voter data:', voter);
    
    const { v_email, v_address } = voter;
    console.log('Extracted email:', v_email);
    console.log('Extracted address:', v_address);
    
    const query = `UPDATE voters SET v_email = ?, v_address = ? WHERE v_email = ?`;
    console.log('SQL Query:', query);
    console.log('Parameters:', [v_email, v_address, email]);
    
    const [result] = await db.query(query, [v_email, v_address, email]);
    console.log('Database result:', result);
    
    if (result.affectedRows === 0) {
      console.log('No rows were updated');
      throw new Error('No voter found with the provided email');
    }
    
    console.log('Update successful, rows affected:', result.affectedRows);
  } catch (error) {
    console.error('Database error in updateVoterByEmail:', error);
    throw error;
  }
}

export async function deleteVoter(id) {
  await db.query('DELETE FROM voters WHERE id = ?', [id]);
}
