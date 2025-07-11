import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function CommitteeResult() {
  const { electionType } = useParams();
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/elections/results/${electionType}`);
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResultData(data);
      } catch (err) {
        setError(err.message || 'Error fetching results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [electionType]);

  const chartData = {
    labels: resultData.map(c => `${c.cand_fname} ${c.cand_lname}`),
    datasets: [
      {
        label: 'Votes',
        data: resultData.map(c => c.vote_count),
        backgroundColor: resultData.map(c => {
          // Find the maximum vote count
          const maxVotes = Math.max(...resultData.map(candidate => candidate.vote_count));
          // Return green if this candidate has the highest votes, red otherwise
          return c.vote_count === maxVotes ? '#28a745' : '#dc3545';
        }),
      },
    ],
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{electionType} Results</h2>
      {loading && <p>Loading results...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && resultData.length === 0 && <p>No votes found for this election.</p>}
      {!loading && !error && resultData.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', borderRadius: '3px' }}></div>
              <span>Highest Votes (Winner)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#dc3545', borderRadius: '3px' }}></div>
              <span>Other Candidates</span>
            </div>
          </div>
          <Bar data={chartData} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, precision: 0 } },
          }} />
        </>
      )}
    </div>
  );
}

export default CommitteeResult; 