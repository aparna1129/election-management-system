import * as queriesModel from '../models/Queries.js';
import * as queriesService from '../services/queriesService.js';

jest.mock('../models/Queries.js');

describe('Queries Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchParliamentCandidates returns data', async () => {
    const mockData = [{ cand_fname: 'John', cand_lname: 'Doe' }];
    queriesModel.getParliamentCandidates.mockResolvedValue(mockData);

    const result = await queriesService.fetchParliamentCandidates();
    expect(result).toEqual(mockData);
    expect(queriesModel.getParliamentCandidates).toHaveBeenCalledTimes(1);
  });

  it('fetchCandidateCountPerElection returns data', async () => {
    const mockData = [{ election_type: 'Parliament', candidate_count: 10 }];
    queriesModel.getCandidateCountPerElection.mockResolvedValue(mockData);

    const result = await queriesService.fetchCandidateCountPerElection();
    expect(result).toEqual(mockData);
  });

  it('fetchGenderCountForParliament returns data', async () => {
    const mockData = [{ c_gender: 'Female', count: 5 }];
    queriesModel.getGenderCountForParliament.mockResolvedValue(mockData);

    const result = await queriesService.fetchGenderCountForParliament();
    expect(result).toEqual(mockData);
  });

  it('fetchFemaleVotersForCandidate returns data', async () => {
    const mockData = [{ voter_fname: 'Jane', v_email: 'jane@example.com' }];
    queriesModel.getFemaleVotersForCandidate.mockResolvedValue(mockData);

    const result = await queriesService.fetchFemaleVotersForCandidate(1);
    expect(result).toEqual(mockData);
    expect(queriesModel.getFemaleVotersForCandidate).toHaveBeenCalledWith(1);
  });

  it('fetchVoteCountForCandidates returns data', async () => {
    const mockData = [{ cand_id: 1, total_votes: 100 }];
    queriesModel.getVoteCountForCandidates.mockResolvedValue(mockData);

    const result = await queriesService.fetchVoteCountForCandidates();
    expect(result).toEqual(mockData);
  });

  it('fetchVoteCountForParliamentCandidates returns data', async () => {
    const mockData = [{ cand_id: 1, total_votes: 80 }];
    queriesModel.getVoteCountForParliamentCandidates.mockResolvedValue(mockData);

    const result = await queriesService.fetchVoteCountForParliamentCandidates();
    expect(result).toEqual(mockData);
  });

  it('fetchParliamentCandidatesOver50 returns data', async () => {
    const mockData = [{ cand_fname: 'Old', cand_lname: 'Candidate' }];
    queriesModel.getParliamentCandidatesOver50.mockResolvedValue(mockData);

    const result = await queriesService.fetchParliamentCandidatesOver50();
    expect(result).toEqual(mockData);
  });

  it('fetchMaleVotersOver50InParliament returns data', async () => {
    const mockData = [{ voter_fname: 'Senior', v_dob: '1960-01-01' }];
    queriesModel.getMaleVotersOver50InParliament.mockResolvedValue(mockData);

    const result = await queriesService.fetchMaleVotersOver50InParliament();
    expect(result).toEqual(mockData);
  });
});
