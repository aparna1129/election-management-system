import * as candidateModel from '../models/Candidate.js';
import * as candidateService from '../services/candidateService.js';

jest.mock('../models/Candidate.js');

describe('Candidate Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      const mockData = [{ cand_id: 1 }, { cand_id: 2 }];
      candidateModel.getAllCandidates.mockResolvedValue(mockData);

      const result = await candidateService.getAllCandidates();

      expect(result).toEqual(mockData);
      expect(candidateModel.getAllCandidates).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCandidateById', () => {
    it('should return candidate by ID', async () => {
      const mockCandidate = { cand_id: 1, cand_fname: 'Aparna' };
      candidateModel.getCandidateById.mockResolvedValue(mockCandidate);

      const result = await candidateService.getCandidateById(1);

      expect(result).toEqual(mockCandidate);
      expect(candidateModel.getCandidateById).toHaveBeenCalledWith(1);
    });

    it('should throw error if candidate not found', async () => {
      candidateModel.getCandidateById.mockResolvedValue(undefined);

      await expect(candidateService.getCandidateById(99)).rejects.toThrow('Candidate not found');
    });
  });

  describe('createCandidate', () => {
    it('should create candidate with valid data', async () => {
      const input = {
        cand_fname: 'Aparna',
        cand_lname: 'S',
        c_gender: 'Female',
        c_dob: '1990-01-01',
        c_aadhar: '123456789012',
        c_email: 'apar@example.com',
        c_contact: '9876543210',
        election_logo: 'logo.png',
        election_id: 1,
      };
      candidateModel.createCandidate.mockResolvedValue(1);

      const result = await candidateService.createCandidate(input);

      expect(result).toEqual({ message: 'Candidate created', id: 1 });
      expect(candidateModel.createCandidate).toHaveBeenCalledWith(input);
    });

    it('should throw error on missing required fields', async () => {
      const badInput = { cand_fname: 'OnlyFirstName' };

      await expect(candidateService.createCandidate(badInput))
        .rejects.toThrow('cand_lname is required');
    });
  });

  describe('updateCandidate', () => {
    it('should update candidate with valid data', async () => {
      const updatedData = {
        cand_fname: 'Updated',
        cand_lname: 'Name',
        c_gender: 'Female',
        c_dob: '1992-05-20',
        c_aadhar: '987654321012',
        c_email: 'update@example.com',
        c_contact: '9123456789',
        election_logo: 'newlogo.png',
        election_id: 2,
      };
      
      // Mock getCandidateById to return existing candidate
      candidateModel.getCandidateById.mockResolvedValue({ cand_id: 1 });
      // Mock updateCandidate
      candidateModel.updateCandidate.mockResolvedValue();

      const result = await candidateService.updateCandidate(1, updatedData);

      expect(result).toEqual({ message: 'Candidate updated' });
      expect(candidateModel.getCandidateById).toHaveBeenCalledWith(1);
      expect(candidateModel.updateCandidate).toHaveBeenCalledWith(1, updatedData);
    });

    it('should throw error if candidate not found', async () => {
      const updatedData = {
        cand_fname: 'Updated',
        cand_lname: 'Name',
        c_gender: 'Female',
        c_dob: '1992-05-20',
        c_aadhar: '987654321012',
        c_email: 'update@example.com',
        c_contact: '9123456789',
        election_logo: 'newlogo.png',
        election_id: 2,
      };
      
      // Mock getCandidateById to return null
      candidateModel.getCandidateById.mockResolvedValue(null);

      await expect(candidateService.updateCandidate(999, updatedData))
        .rejects.toThrow('Candidate not found');
      
      expect(candidateModel.getCandidateById).toHaveBeenCalledWith(999);
      expect(candidateModel.updateCandidate).not.toHaveBeenCalled();
    });

    it('should throw error on invalid update data', async () => {
      await expect(candidateService.updateCandidate(1, {}))
        .rejects.toThrow('cand_fname is required');
    });
  });

  describe('deleteCandidate', () => {
    it('should delete candidate by ID', async () => {
      // Mock getCandidateById to return existing candidate
      candidateModel.getCandidateById.mockResolvedValue({ cand_id: 1 });
      // Mock deleteCandidate
      candidateModel.deleteCandidate.mockResolvedValue({ affectedRows: 1 });

      const result = await candidateService.deleteCandidate(1);

      expect(result).toEqual({ message: 'Candidate deleted' });
      expect(candidateModel.getCandidateById).toHaveBeenCalledWith(1);
      expect(candidateModel.deleteCandidate).toHaveBeenCalledWith(1);
    });

    it('should throw error if candidate not found', async () => {
      // Mock getCandidateById to return null
      candidateModel.getCandidateById.mockResolvedValue(null);

      await expect(candidateService.deleteCandidate(999))
        .rejects.toThrow('Candidate not found');
      
      expect(candidateModel.getCandidateById).toHaveBeenCalledWith(999);
      expect(candidateModel.deleteCandidate).not.toHaveBeenCalled();
    });
  });
});