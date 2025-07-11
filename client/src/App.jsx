import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import VoterDashboard from './components/DashboardVoter';
import CommitteeDashboard from './components/DashboardCommittee';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import VoterProfile from './components/VoterProfile';
import VoterRegister from './components/VoterRegister';
import CommitteeResult from './components/CommitteeResult';
import './styles/App.css';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Check registration status for voter
  const checkRegistration = async (user) => {
    console.log('Checking registration for user:', user);
    if (!user || user.role !== 'voter') {
      console.log('User is not a voter, setting isRegistered to false');
      setIsRegistered(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, setting isRegistered to false');
        setIsRegistered(false);
        return;
      }
      console.log('Making request to /api/voters/me...');
      const res = await fetch('http://localhost:5000/api/voters/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      // If response is not ok (404, 500, etc.), user is not registered as a voter
      if (!res.ok) {
        console.log('Response not ok, user is not registered as a voter');
        setIsRegistered(false);
        return;
      }
      
      const data = await res.json();
      console.log('Voter data received:', data);
      // If we get data back, user is registered as a voter
      const isVoterRegistered = !!data;
      console.log('Setting isRegistered to:', isVoterRegistered);
      setIsRegistered(isVoterRegistered);
    } catch (error) {
      console.error('Error checking registration:', error);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, role: payload.role });
        setIsRegistered(false); // Default to not registered on login/signup
        checkRegistration({ username: payload.username, role: payload.role });
      } catch (e) {
        setUser(null);
        setIsRegistered(false);
      }
    } else {
      setIsRegistered(false);
    }
  }, []);

  // Handler to set isRegistered true after registration
  const handleRegistered = () => {
    setIsRegistered(true);
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} setShowLogin={setShowLogin} setShowSignup={setShowSignup} setUser={setUser} isRegistered={isRegistered} checkRegistration={checkRegistration} setShowRegister={setShowRegister} handleRegistered={handleRegistered} />

        {showLogin && <LoginModal close={() => setShowLogin(false)} setUser={setUser} />}
        {showSignup && <SignupModal close={() => setShowSignup(false)} setUser={setUser} />}
        {showRegister && <VoterRegister close={() => setShowRegister(false)} onRegistered={handleRegistered} />}

        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/voter" element={<ProtectedRoute user={user}><VoterDashboard isRegistered={isRegistered} checkRegistration={checkRegistration} /></ProtectedRoute>} />
            <Route path="/committee" element={<ProtectedRoute user={user}><CommitteeDashboard /></ProtectedRoute>} />
            <Route path="/voter/profile" element={<ProtectedRoute user={user}><VoterProfile isRegistered={isRegistered} setShowRegister={setShowRegister} /></ProtectedRoute>} />
            <Route path="/committee/result/:electionType" element={<ProtectedRoute user={user}><CommitteeResult /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
