import * as voterService from '../services/voterService.js';
import db from '../config/db.js';

export async function testDatabase(req, res) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('Connection test result:', rows);
    
    // Check voters table structure
    const [columns] = await db.query('DESCRIBE voters');
    console.log('Voters table structure:', columns);
    
    // Check if v_address column exists
    const hasAddressColumn = columns.some(col => col.Field === 'v_address');
    console.log('Has v_address column:', hasAddressColumn);
    
    res.status(200).json({
      message: 'Database connection successful',
      tableStructure: columns,
      hasAddressColumn: hasAddressColumn
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getAllVoters(req, res) {
  try {
    const voters = await voterService.getAllVoters();
    res.status(200).json(voters);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch voters' });
  }
}

export async function getVoterById(req, res) {
  try {
    const voter = await voterService.getVoterById(req.params.id);
    res.status(200).json(voter);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch voter' });
  }
}

export async function getVoterByEmail(req, res) {
  try {
    const voter = await voterService.getVoterByEmail(req.user.email);
    res.status(200).json(voter);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch voter' });
  }
}

export async function updateVoterByEmail(req, res) {
  try {
    console.log('updateVoterByEmail called');
    console.log('User email:', req.user.email);
    console.log('Request body:', req.body);
    
    const updatedVoter = await voterService.updateVoterByEmail(req.user.email, req.body);
    console.log('Update result:', updatedVoter);
    
    res.status(200).json(updatedVoter);
  } catch (error) {
    console.error('Update error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to update voter' });
  }
}

export async function createVoter(req, res) {
  try {
    const id = await voterService.createVoter(req.body);
    res.status(201).json({ message: 'Voter created', id });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to create voter' });
  }
}

export async function updateVoter(req, res) {
  try {
    await voterService.updateVoter(req.params.id, req.body);
    res.status(200).json({ message: 'Voter updated' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to update voter' });
  }
}

export async function deleteVoter(req, res) {
  try {
    await voterService.deleteVoter(req.params.id);
    res.status(200).json({ message: 'Voter deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Failed to delete voter' });
  }
}
