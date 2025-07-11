import * as votesModel from '../models/Votes.js';
import * as votesService from '../services/votesService.js';

jest.mock('../models/Votes.js');

describe('Votes Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVotes', () => {
    it('should return all votes', async () => {
      const mockVotes = [{ votes_id: 1 }, { votes_id: 2 }];
      votesModel.getAllVotes.mockResolvedValue(mockVotes);

      const result = await votesService.getAllVotes();

      expect(result).toEqual(mockVotes);
      expect(votesModel.getAllVotes).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVoteById', () => {
    it('should return a vote by ID', async () => {
      const mockVote = { votes_id: 1, voter_id: 101 };
      votesModel.getVoteById.mockResolvedValue(mockVote);

      const result = await votesService.getVoteById(1);

      expect(result).toEqual(mockVote);
      expect(votesModel.getVoteById).toHaveBeenCalledWith(1);
    });

    it('should throw error if vote not found', async () => {
      votesModel.getVoteById.mockResolvedValue(undefined);

      await expect(votesService.getVoteById(999)).rejects.toThrow('Vote not found');
    });
  });

  describe('createVote', () => {
    it('should create a vote with valid data', async () => {
      const newVote = {
        voter_id: 1,
        cand_id: 2,
        election_id: 3,
      };
      votesModel.createVote.mockResolvedValue({ insertId: 101 });

      const result = await votesService.createVote(newVote);

      expect(result).toEqual({ message: 'Vote created', id: 101 });
      expect(votesModel.createVote).toHaveBeenCalledWith(newVote);
    });

    it('should throw error for missing fields', async () => {
      const invalidVote = { voter_id: 1 };

      await expect(votesService.createVote(invalidVote))
        .rejects.toThrow('Invalid vote data');
    });
  });

  describe('updateVote', () => {
    it('should update a vote with valid data', async () => {
      const updatedVote = {
        voter_id: 5,
        cand_id: 6,
        election_id: 7,
      };
      
      // Mock getVoteById to return existing vote
      votesModel.getVoteById.mockResolvedValue({ votes_id: 1 });
      // Mock updateVote to succeed
      votesModel.updateVote.mockResolvedValue({ affectedRows: 1 });

      const result = await votesService.updateVote(1, updatedVote);

      expect(result).toEqual({ message: 'Vote updated' });
      expect(votesModel.getVoteById).toHaveBeenCalledWith(1);
      expect(votesModel.updateVote).toHaveBeenCalledWith(1, updatedVote);
    });

    it('should throw error if vote not found', async () => {
      const updatedVote = {
        voter_id: 5,
        cand_id: 6,
        election_id: 7,
      };
      
      // Mock getVoteById to return null (vote not found)
      votesModel.getVoteById.mockResolvedValue(null);

      await expect(votesService.updateVote(999, updatedVote))
        .rejects.toThrow('Vote not found');
      
      expect(votesModel.getVoteById).toHaveBeenCalledWith(999);
      // updateVote should not be called if vote doesn't exist
      expect(votesModel.updateVote).not.toHaveBeenCalled();
    });

    it('should throw error for invalid data', async () => {
      await expect(votesService.updateVote(1, {}))
        .rejects.toThrow('Invalid vote data');
    });
  });

  describe('deleteVote', () => {
    it('should delete a vote by ID', async () => {
      // Mock getVoteById to return existing vote
      votesModel.getVoteById.mockResolvedValue({ votes_id: 1 });
      // Mock deleteVote to succeed
      votesModel.deleteVote.mockResolvedValue({ affectedRows: 1 });

      const result = await votesService.deleteVote(1);

      expect(result).toEqual({ message: 'Vote deleted' });
      expect(votesModel.getVoteById).toHaveBeenCalledWith(1);
      expect(votesModel.deleteVote).toHaveBeenCalledWith(1);
    });

    it('should throw error if vote not found during lookup', async () => {
      // Mock getVoteById to return null (vote not found)
      votesModel.getVoteById.mockResolvedValue(null);

      await expect(votesService.deleteVote(999))
        .rejects.toThrow('Vote not found');
      
      expect(votesModel.getVoteById).toHaveBeenCalledWith(999);
      // deleteVote should not be called if vote doesn't exist
      expect(votesModel.deleteVote).not.toHaveBeenCalled();
    });

    it('should throw error if vote not found during deletion', async () => {
      // Mock getVoteById to return existing vote
      votesModel.getVoteById.mockResolvedValue({ votes_id: 1 });
      // Mock deleteVote to return 0 affected rows
      votesModel.deleteVote.mockResolvedValue({ affectedRows: 0 });

      await expect(votesService.deleteVote(1))
        .rejects.toThrow('Vote not found');
      
      expect(votesModel.getVoteById).toHaveBeenCalledWith(1);
      expect(votesModel.deleteVote).toHaveBeenCalledWith(1);
    });
  });
});