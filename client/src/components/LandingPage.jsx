import '../styles/LandingPage.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import voteImg from '../assets/vote_img.PNG';

function LandingPage({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'voter') navigate('/voter');
      else if (user.role === 'committee') navigate('/committee');
    }
  }, [user, navigate]);

  return (
    <div className="landing-page">
      <h2>Welcome to the Election Management System</h2>
      <p>
        This platform allows voters to cast their votes securely and committee members to manage elections efficiently.
        Please login or sign up to continue.
      </p>
      <img src={voteImg} alt="Voting illustration" className="landing-vote-img" />
      {/* <img src="/assets/voting-banner.jpg" alt="Voting banner" /> optional image */}
    </div>
  );
}

export default LandingPage;
