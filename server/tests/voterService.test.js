import * as voterModel from '../models/Voter.js';
import * as voterService from '../services/voterService.js';

jest.mock('../models/Voter.js');

describe('Voter Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVoters', () => {
    it('should return all voters', async () => {
      const mockVoters = [{ voter_id: 1 }, { voter_id: 2 }];
      voterModel.getAllVoters.mockResolvedValue(mockVoters);

      const result = await voterService.getAllVoters();

      expect(result).toEqual(mockVoters);
      expect(voterModel.getAllVoters).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVoterById', () => {
    it('should return voter by ID', async () => {
      const mockVoter = { voter_id: 1, voter_fname: 'Aparna' };
      voterModel.getVoterById.mockResolvedValue(mockVoter);

      const result = await voterService.getVoterById(1);

      expect(result).toEqual(mockVoter);
      expect(voterModel.getVoterById).toHaveBeenCalledWith(1);
    });

    it('should throw error if voter not found', async () => {
      voterModel.getVoterById.mockResolvedValue(undefined);

      await expect(voterService.getVoterById(99)).rejects.toThrow('Voter not found');
    });
  });

  describe('createVoter', () => {
    it('should create voter with valid input', async () => {
      const validVoter = {
        voter_fname: 'John',
        voter_lname: 'Doe',
        v_gender: 'Male',
        v_dob: '1990-01-01',
        v_aadhar: '123456789012',
        v_email: 'john@example.com',
        v_contact: '9876543210'
      };
      voterModel.createVoter.mockResolvedValue(1);

      const result = await voterService.createVoter(validVoter);

      expect(result).toEqual({ message: 'Voter created', id: 1 });
      expect(voterModel.createVoter).toHaveBeenCalledWith(validVoter);
    });

    it('should throw error on missing fields', async () => {
      const invalidVoter = { voter_fname: 'OnlyName' };

      await expect(voterService.createVoter(invalidVoter))
        .rejects.toThrow('voter_lname is required');
    });
  });

  describe('updateVoter', () => {
    it('should update voter with valid input', async () => {
      const updatedData = {
        voter_fname: 'Updated',
        voter_lname: 'Name',
        v_gender: 'Female',
        v_dob: '1995-03-25',
        v_aadhar: '987654321012',
        v_email: 'update@example.com',
        v_contact: '9123456789'
      };
      
      // Mock getVoterById to return existing voter
      voterModel.getVoterById.mockResolvedValue({ voter_id: 1 });
      // Mock updateVoter
      voterModel.updateVoter.mockResolvedValue();

      const result = await voterService.updateVoter(1, updatedData);

      expect(result).toEqual({ message: 'Voter updated' });
      expect(voterModel.getVoterById).toHaveBeenCalledWith(1);
      expect(voterModel.updateVoter).toHaveBeenCalledWith(1, updatedData);
    });

    it('should throw error if voter not found', async () => {
      const updatedData = {
        voter_fname: 'Updated',
        voter_lname: 'Name',
        v_gender: 'Female',
        v_dob: '1995-03-25',
        v_aadhar: '987654321012',
        v_email: 'update@example.com',
        v_contact: '9123456789'
      };
      
      // Mock getVoterById to return null
      voterModel.getVoterById.mockResolvedValue(null);

      await expect(voterService.updateVoter(999, updatedData))
        .rejects.toThrow('Voter not found');
      
      expect(voterModel.getVoterById).toHaveBeenCalledWith(999);
      expect(voterModel.updateVoter).not.toHaveBeenCalled();
    });

    it('should throw error on invalid input', async () => {
      await expect(voterService.updateVoter(1, {}))
        .rejects.toThrow('voter_fname is required');
      
      // getVoterById should not be called if validation fails
      expect(voterModel.getVoterById).not.toHaveBeenCalled();
    });
  });

  describe('deleteVoter', () => {
    it('should delete voter by ID', async () => {
      // Mock getVoterById to return existing voter
      voterModel.getVoterById.mockResolvedValue({ voter_id: 1 });
      // Mock deleteVoter
      voterModel.deleteVoter.mockResolvedValue({ affectedRows: 1 });

      const result = await voterService.deleteVoter(1);

      expect(result).toEqual({ message: 'Voter deleted' });
      expect(voterModel.getVoterById).toHaveBeenCalledWith(1);
      expect(voterModel.deleteVoter).toHaveBeenCalledWith(1);
    });

    it('should throw error if voter not found', async () => {
      // Mock getVoterById to return null
      voterModel.getVoterById.mockResolvedValue(null);

      await expect(voterService.deleteVoter(999))
        .rejects.toThrow('Voter not found');
      
      expect(voterModel.getVoterById).toHaveBeenCalledWith(999);
      expect(voterModel.deleteVoter).not.toHaveBeenCalled();
    });
  });
});