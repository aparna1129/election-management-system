import { useRef } from 'react';
import html2canvas from 'html2canvas';

function VotingReceiptCard({ electionType, candidate, voterData, onDownload }) {
  const cardRef = useRef(null);

  const downloadReceipt = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `voting-receipt-${electionType}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const formatDate = (date) => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="receipt-card-container">
      <div ref={cardRef} className="receipt-card-content">
        <div className="receipt-header">
          <div className="receipt-logo">🗳️</div>
          <h2>Voting Receipt</h2>
          <div className="receipt-date">{formatDate()}</div>
        </div>
        
        <div className="receipt-body">
          <div className="receipt-section">
            <h3>Election Details</h3>
            <div className="receipt-info">
              <span className="label">Election Type:</span>
              <span className="value">{electionType}</span>
            </div>
          </div>
          
          <div className="receipt-section">
            <h3>Voter Information</h3>
            <div className="receipt-info">
              <span className="label">Name:</span>
              <span className="value">{voterData?.voter_fname} {voterData?.voter_lname}</span>
            </div>
            <div className="receipt-info">
              <span className="label">Voter ID:</span>
              <span className="value">{voterData?.voter_id}</span>
            </div>
            <div className="receipt-info">
              <span className="label">Aadhar:</span>
              <span className="value">{voterData?.v_aadhar}</span>
            </div>
          </div>
          
          <div className="receipt-section">
            <h3>Vote Cast For</h3>
            <div className="candidate-info">
              <div className="candidate-name">
                {candidate.cand_fname} {candidate.cand_lname}
              </div>
              <div className="candidate-id">Candidate ID: {candidate.cand_id}</div>
            </div>
          </div>
          
          <div className="receipt-footer">
            <div className="receipt-status">
              <span className="status-badge">✓ Vote Cast Successfully</span>
            </div>
            <div className="receipt-note">
              This receipt serves as proof of your participation in the democratic process.
            </div>
          </div>
        </div>
      </div>
      
      <button className="download-btn" onClick={downloadReceipt}>
        Download Receipt
      </button>
    </div>
  );
}

export default VotingReceiptCard; 