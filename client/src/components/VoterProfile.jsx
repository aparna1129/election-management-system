import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VoterProfile.css';

function VoterProfile({ isRegistered, setShowRegister }) {
  const [voterData, setVoterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editableEmail, setEditableEmail] = useState('');
  const [editableAddress, setEditableAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegistered) {
      setLoading(false);
      return;
    }

    const fetchVoterData = async () => {
      try {
    const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/voters/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Voter registration not found. Please register first.');
          } else {
            setError('Failed to fetch voter data');
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setVoterData(data);
        setEditableEmail(data.v_email || '');
        setEditableAddress(data.v_address || '');
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Error fetching voter data');
      } finally {
        setLoading(false);
      }
    };

    fetchVoterData();
  }, [isRegistered]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegisterClick = () => {
    if (setShowRegister) {
      setShowRegister(true);
    }
  };

  const testDatabase = async () => {
    try {
      console.log('Testing database structure...');
      const res = await fetch('http://localhost:5000/api/voters/test');
      const data = await res.json();
      console.log('Database test result:', data);
    } catch (err) {
      console.error('Database test error:', err);
    }
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Saving changes...');
      console.log('Email:', editableEmail);
      console.log('Address:', editableAddress);
      
      // Test database structure first
      await testDatabase();
      
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/voters/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          v_email: editableEmail,
          v_address: editableAddress
        })
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (res.ok) {
        const result = await res.json();
        console.log('Save result:', result);
        setSaveMessage('Changes saved successfully!');
        setIsEditing(false);
        // Update the voterData with new values
        setVoterData(prev => ({
          ...prev,
          v_email: editableEmail,
          v_address: editableAddress
        }));
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorData = await res.json();
        console.error('Save error:', errorData);
        setSaveMessage('Failed to save changes');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('Error saving changes');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditableEmail(voterData?.v_email || '');
    setEditableAddress(voterData?.v_address || '');
    setIsEditing(false);
    setSaveMessage('');
  };

  if (!isRegistered) {
    return (
      <div className="voter-profile">
        <div className="profile-message">
          <h2>Voter Profile</h2>
          <p>Please register yourself to see your profile.</p>
          <button onClick={handleRegisterClick} className="register-btn">Register</button>
          <button onClick={() => navigate('/voter')} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="voter-profile">
        <div className="profile-message">
          <p>Loading voter data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voter-profile">
        <div className="profile-message">
          <h2>Voter Profile</h2>
          <p className="error">{error}</p>
          <button onClick={handleRegisterClick} className="register-btn">Register</button>
          <button onClick={() => navigate('/voter')} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  if (!voterData) {
    return (
      <div className="voter-profile">
        <div className="profile-message">
          <h2>Voter Profile</h2>
          <p>No voter data found. Please register first.</p>
          <button onClick={handleRegisterClick} className="register-btn">Register</button>
          <button onClick={() => navigate('/voter')} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-profile">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>
      
      <div className="profile-content">
      <div className="profile-left">
        <div className="profile-icon-big">👤</div>
      </div>
        
      <div className="profile-right">
          <div className="profile-info">
            <div className="info-row">
              <label>Full Name:</label>
              <span>{voterData.voter_fname} {voterData.voter_lname}</span>
            </div>
            
            <div className="info-row">
              <label>Gender:</label>
              <span>{voterData.v_gender}</span>
            </div>
            
            <div className="info-row">
              <label>Date of Birth:</label>
              <span>{formatDate(voterData.v_dob)}</span>
            </div>
            
            <div className="info-row">
              <label>Nationality:</label>
              <span>{voterData.nationality || 'Indian'}</span>
            </div>
            
            <div className="info-row">
              <label>Email Address:</label>
              {isEditing ? (
          <input
            type="email"
                  value={editableEmail}
                  onChange={(e) => setEditableEmail(e.target.value)}
                  className="editable-input"
                />
              ) : (
                <span>{voterData.v_email}</span>
              )}
            </div>
            
            <div className="info-row">
              <label>Contact Number:</label>
              <span>{voterData.v_contact}</span>
            </div>
            
            <div className="info-row">
              <label>Address:</label>
              {isEditing ? (
          <input
            type="text"
                  value={editableAddress}
                  onChange={(e) => setEditableAddress(e.target.value)}
                  className="editable-input"
                />
              ) : (
                <span>{voterData.v_address || 'Not provided'}</span>
              )}
            </div>
            
            <div className="info-row">
              <label>Aadhar Number:</label>
              <span>{voterData.v_aadhar}</span>
            </div>
          </div>

          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('successfully') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
                <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                <button onClick={() => navigate('/voter')} className="close-btn">Close</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoterProfile;
