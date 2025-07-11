import * as electionModel from '../models/Election.js';
import * as electionService from '../services/electionService.js';

jest.mock('../models/Election.js');

describe('Election Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllElections', () => {
    it('should return all elections', async () => {
      const mockData = [
        { election_id: 1, election_type: 'Parliament' },
        { election_id: 2, election_type: 'Assembly' },
      ];

      electionModel.getAllElections.mockResolvedValue(mockData);

      const result = await electionService.getAllElections();

      expect(result).toEqual(mockData);
      expect(electionModel.getAllElections).toHaveBeenCalledTimes(1);
    });
  });

  describe('getElectionById', () => {
    it('should return a single election by ID', async () => {
      const mockElection = { election_id: 1, election_type: 'Parliament' };

      electionModel.getElectionById.mockResolvedValue(mockElection);

      const result = await electionService.getElectionById(1);

      expect(result).toEqual(mockElection);
      expect(electionModel.getElectionById).toHaveBeenCalledWith(1);
    });

    it('should throw error if election not found', async () => {
      electionModel.getElectionById.mockResolvedValue(undefined);

      await expect(electionService.getElectionById(99)).rejects.toThrow('Election not found');
    });
  });

  describe('createElection', () => {
    it('should create an election with valid input', async () => {
      const input = { election_type: 'Parliament' };
      electionModel.createElection.mockResolvedValue({ insertId: 1 });

      const result = await electionService.createElection(input);

      expect(result).toEqual({ message: 'Election created', id: 1 });
      expect(electionModel.createElection).toHaveBeenCalledWith(input);
    });

    it('should throw error for invalid input', async () => {
      const badInput = {};

      await expect(electionService.createElection(badInput))
        .rejects.toThrow('election_type is required');
    });
  });

  describe('updateElection', () => {
    it('should update election with valid data', async () => {
      const updatedData = { election_type: 'Assembly' };

      // Mock updateElection to return successful result
      electionModel.updateElection.mockResolvedValue({ affectedRows: 1 });

      const result = await electionService.updateElection(1, updatedData);

      expect(result).toEqual({ message: 'Election updated' });
      expect(electionModel.updateElection).toHaveBeenCalledWith(1, updatedData);
    });

    it('should throw error if election not found during update', async () => {
      const updatedData = { election_type: 'Assembly' };
      
      // Mock updateElection to return 0 affected rows
      electionModel.updateElection.mockResolvedValue({ affectedRows: 0 });

      await expect(electionService.updateElection(999, updatedData))
        .rejects.toThrow('Election not found');
      
      expect(electionModel.updateElection).toHaveBeenCalledWith(999, updatedData);
    });

    it('should throw error if election_type is missing', async () => {
      await expect(electionService.updateElection(1, {}))
        .rejects.toThrow('election_type is required');
      
      // updateElection should not be called if validation fails
      expect(electionModel.updateElection).not.toHaveBeenCalled();
    });
  });

  describe('deleteElection', () => {
    it('should delete election by ID', async () => {
      electionModel.deleteElection.mockResolvedValue({ affectedRows: 1 });

      const result = await electionService.deleteElection(1);

      expect(result).toEqual({ message: 'Election deleted' });
      expect(electionModel.deleteElection).toHaveBeenCalledWith(1);
    });

    it('should throw error if no rows were deleted', async () => {
      electionModel.deleteElection.mockResolvedValue({ affectedRows: 0 });

      await expect(electionService.deleteElection(99)).rejects.toThrow('Election not found');
      
      expect(electionModel.deleteElection).toHaveBeenCalledWith(99);
    });
  });
});