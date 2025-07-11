import { useState, useEffect } from 'react';
import '../styles/DashboardVoter.css';
import voteImg from '../assets/vote_img.PNG';

function DashboardVoter({ isRegistered }) {
  const [activeTab, setActiveTab] = useState('Voter');
  const [electionType, setElectionType] = useState('NagarParishad');
  const [candidates, setCandidates] = useState([]);
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [voteStatus, setVoteStatus] = useState({});
  const [votedCandidates, setVotedCandidates] = useState({});
  const [toast, setToast] = useState('');
  const [currentVoter, setCurrentVoter] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get current voter information
  useEffect(() => {
    const fetchCurrentVoter = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/voters/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const voterData = await response.json();
          setCurrentVoter(voterData);
          // Load voting history for this voter
          await loadVotingHistory(voterData.voter_id);
        }
      } catch (error) {
        console.error('Error fetching current voter:', error);
      }
    };

    fetchCurrentVoter();
  }, []);

  // Load voting history for the current voter
  const loadVotingHistory = async (voterId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/votes/history/${voterId}`);
      if (response.ok) {
        const history = await response.json();
        
        // Create vote status object
        const status = {};
        const voted = {};
        
        history.forEach(vote => {
          status[vote.election_type] = true;
          voted[vote.election_type] = {
            cand_fname: vote.cand_fname,
            cand_lname: vote.cand_lname,
            cand_id: vote.cand_id
          };
        });
        
        setVoteStatus(status);
        setVotedCandidates(voted);
      }
    } catch (error) {
      console.error('Error loading voting history:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'Elections') {
      fetchCandidates(electionType);
    }
    // eslint-disable-next-line
  }, [activeTab, electionType]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCandidates = async (type) => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates?electionType=${type}`);
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      setCandidates([]);
    }
  };

  const handleDragStart = (candidate) => {
    setDraggedCandidate(candidate);
  };

  const handleDrop = async (e) => {
    console.log('Drop event fired');
    e.preventDefault(); // Prevent default browser behavior
    console.log('Current voter:', currentVoter);
    console.log('Dragged candidate:', draggedCandidate);
    console.log('Vote status:', voteStatus);
    console.log('Election type:', electionType);
    
    if (!currentVoter || !draggedCandidate || voteStatus[electionType]) {
      console.log('Drop blocked - conditions not met');
      setDraggedCandidate(null);
      return;
    }

    setLoading(true);
    try {
      console.log('Getting election ID for:', electionType);
      // Get election ID for the current election type
      const electionResponse = await fetch(`http://localhost:5000/api/elections/type/${electionType}`);
      console.log('Election response status:', electionResponse.status);
      
      if (!electionResponse.ok) {
        const errorText = await electionResponse.text();
        console.error('Election response error:', errorText);
        throw new Error('Failed to get election information');
      }
      
      const election = await electionResponse.json();
      console.log('Election data:', election);

      // Create the vote
      const voteData = {
        voter_id: currentVoter.voter_id,
        cand_id: draggedCandidate.cand_id,
        election_id: election.election_id
      };
      
      console.log('Vote data to send:', voteData);

      const voteResponse = await fetch('http://localhost:5000/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData)
      });
      
      console.log('Vote response status:', voteResponse.status);

      if (voteResponse.ok) {
        // Update local state
        const newStatus = { ...voteStatus, [electionType]: true };
        setVoteStatus(newStatus);
        
        const newVoted = { 
          ...votedCandidates, 
          [electionType]: {
            cand_fname: draggedCandidate.cand_fname,
            cand_lname: draggedCandidate.cand_lname,
            cand_id: draggedCandidate.cand_id
          }
        };
        setVotedCandidates(newVoted);
        
        setToast('Vote cast successfully!');
        console.log('Vote cast successfully!');
      } else {
        const errorData = await voteResponse.json();
        console.error('Vote response error:', errorData);
        setToast(`Error: ${errorData.error || 'Failed to cast vote'}`);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      setToast('Error casting vote. Please try again.');
    } finally {
      setLoading(false);
      setDraggedCandidate(null);
    }
  };

  const handleDragOver = (e) => {
    console.log('Drag over event fired');
    e.preventDefault();
  };

  return (
    <div className="voter-dashboard">
      <div className="voter-tabs">
        <button
          className={activeTab === 'Voter' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Voter')}
        >
          Voter
        </button>
        <button
          className={activeTab === 'Elections' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Elections')}
        >
          Elections
        </button>
        <button
          className={activeTab === 'Receipt' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Receipt')}
        >
          Receipt
        </button>
      </div>
      {activeTab === 'Voter' && (
        <div>
          <h2 className="voter-welcome">Welcome, Voter!</h2>
          <p className="voter-info">
            This is your personal dashboard where you can manage your voter profile, register for elections, and view updates.
            Please make sure your information is up to date.
          </p>
          <div className="voter-tab-img-wrapper">
            <img src={voteImg} alt="Voting illustration" className="voter-tab-img" />
          </div>
        </div>
      )}
      {activeTab === 'Elections' && (
        <div>
          <div className="election-type-tabs">
            {['NagarParishad', 'Loksabha', 'Vidhansabha'].map(type => (
              <button
                key={type}
                className={electionType === type ? 'election-type-tab active' : 'election-type-tab'}
                onClick={() => setElectionType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          {!isRegistered ? (
            <div className="not-registered-msg">You must complete registration to vote in elections.</div>
          ) : (
            <>
              <div className="candidate-cards">
                {candidates.length === 0 ? (
                  <p>No candidates found for {electionType}.</p>
                ) : (
                  candidates.map(c => (
                    <div
                      className={`candidate-card${voteStatus[electionType] ? ' disabled' : ''}`}
                      key={c.cand_id}
                      draggable={!voteStatus[electionType] && !loading}
                      onDragStart={() => handleDragStart(c)}
                      style={{ 
                        opacity: voteStatus[electionType] ? 0.5 : 1, 
                        cursor: voteStatus[electionType] || loading ? 'not-allowed' : 'grab' 
                      }}
                    >
                      <h3>{c.cand_fname} {c.cand_lname}</h3>
                      <p><strong>Gender:</strong> {c.c_gender}</p>
                      <p><strong>DOB:</strong> {typeof c.c_dob === 'string' ? c.c_dob.slice(0, 10) : c.c_dob}</p>
                      <p><strong>Aadhar:</strong> {c.c_aadhar}</p>
                      <p><strong>Email:</strong> {c.c_email}</p>
                      <p><strong>Contact:</strong> {c.c_contact}</p>
                      <p><strong>Address:</strong> {c.c_address}</p>
                    </div>
                  ))
                )}
              </div>
              <div
                className={`drop-box${voteStatus[electionType] ? ' disabled' : ''}`}
                onDrop={voteStatus[electionType] || loading ? undefined : handleDrop}
                onDragOver={voteStatus[electionType] || loading ? undefined : handleDragOver}
                style={{
                  marginTop: '2rem',
                  padding: '2rem',
                  border: '2px dashed #0077cc',
                  borderRadius: '10px',
                  background: voteStatus[electionType] ? '#e0e7ef' : '#f7f9fc',
                  color: voteStatus[electionType] ? '#aaa' : '#0077cc',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  minHeight: '80px',
                  pointerEvents: voteStatus[electionType] || loading ? 'none' : 'auto',
                  transition: 'background 0.2s',
                }}
              >
                {loading 
                  ? 'Processing your vote...'
                  : voteStatus[electionType]
                    ? 'You have already cast your vote for this election.'
                    : 'Drag and drop a candidate card here to cast your vote.'}
              </div>
              {toast && <div className="vote-toast">{toast}</div>}
            </>
          )}
        </div>
      )}
      {activeTab === 'Receipt' && (
        <div className="receipt-section">
          {['NagarParishad', 'Loksabha', 'Vidhansabha'].map(type => (
            votedCandidates[type] ? (
              <div className="receipt-card" key={type}>
                You have voted for <strong>{votedCandidates[type].cand_fname} {votedCandidates[type].cand_lname}</strong> in the <strong>{type}</strong> election
              </div>
            ) : null
          ))}
          {Object.keys(votedCandidates).length === 0 && (
            <div className="receipt-card">You have not cast any votes yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardVoter;