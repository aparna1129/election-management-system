import * as Voter from '../models/Voter.js';

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

function validateVoterInput(data) {
  const requiredFields = [
    'voter_fname',
    'voter_lname',
    'v_gender',
    'v_dob',
    'v_aadhar',
    'v_email',
    'v_contact',
    'v_address'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Age validation
  const age = calculateAge(data.v_dob);
  if (age < 18) {
    throw new Error('Voters must be 18 years or older to register');
  }
}

export async function getAllVoters() {
  const voters = await Voter.getAllVoters();
  return voters;
}

export async function getVoterById(id) {
  const voter = await Voter.getVoterById(id);
  if (!voter) {
    const error = new Error('Voter not found');
    error.status = 404;
    throw error;
  }
  return voter;
}

export async function getVoterByEmail(email) {
  const voter = await Voter.getVoterByEmail(email);
  if (!voter) {
    const error = new Error('Voter not found');
    error.status = 404;
    throw error;
  }
  return voter;
}

export async function updateVoterByEmail(email, data) {
  console.log('updateVoterByEmail service called');
  console.log('Email:', email);
  console.log('Data:', data);
  
  const voter = await Voter.getVoterByEmail(email);
  console.log('Found voter:', voter);
  
  if (!voter) {
    const error = new Error('Voter not found');
    error.status = 404;
    throw error;
  }
  
  console.log('Updating voter in database...');
  await Voter.updateVoterByEmail(email, data);
  console.log('Voter updated successfully');
  
  return { message: 'Voter updated successfully' };
}

export async function createVoter(data) {
  validateVoterInput(data);
  const insertId = await Voter.createVoter(data);
  return { message: 'Voter created', id: insertId };
}

export async function updateVoter(id, data) {
  const voter = await Voter.getVoterById(id);
  if (!voter) {
    const error = new Error('Voter not found');
    error.status = 404;
    throw error;
  }
  await Voter.updateVoter(id, data);
  return { message: 'Voter updated' };
}

export async function deleteVoter(id) {
  const voter = await Voter.getVoterById(id);
  if (!voter) {
    const error = new Error('Voter not found');
    error.status = 404;
    throw error;
  }
  await Voter.deleteVoter(id);
  return { message: 'Voter deleted' };
}