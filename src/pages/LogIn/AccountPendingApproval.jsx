import React from 'react';
import './LogIn.css';
import { MdCheckCircle, MdEmail, MdHome } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';

function AccountPendingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get account type from navigation state, default to 'member'
  const accountType = location.state?.accountType || 'member';
  const userEmail = location.state?.userEmail || '';

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="create-account-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="return-container">
            <div className={`logo-icon ${accountType === 'admin' ? 'admin-icon' : 'member-icon'}`}></div>
            <span className="signup-label">
              Account Created - {accountType === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>
        
        <div className="sidebar-content">
          <h2 className="sidebar-title">
            Account Successfully Created!
          </h2>
          <p className="sidebar-description">
            Your account has been created and is pending approval.
          </p>
        </div>

        <div className="sidebar-footer">
          <p>If you have any questions about the approval process, feel free to contact exec.</p>
        </div>
      </div>

      <div className="main-content">
        <div className="content-container">
          <div className="form-section" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdCheckCircle size={50} style={{ color: '#28a745', marginBottom: '1rem' }} />
              <h1 className="page-title" style={{margin: 'auto 2rem'}}>Account Created!</h1>
            </div>

            <div className="approval-info" style={{ 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              padding: '2rem', 
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MdEmail size={24} style={{ color: '#007bff', marginRight: '0.5rem' }} />
                <h3 style={{ margin: 0, color: '#495057' }}>What happens next?</h3>
              </div>
              
              <div style={{ marginLeft: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  <strong>1. Account Review:</strong> An administrator will review your account information.
                </p>
                <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  <strong>2. Email Notification:</strong> You'll receive an email confirmation once your account is approved.
                </p>
                <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  <strong>3. Full Access:</strong> After approval, you'll be able to:
                </p>
                <ul style={{ marginLeft: '1rem', color: '#6c757d' }}>
                  <li>Sign up for events</li>
                  <li>Appear on the members directory</li>
                  <li>Access all member features</li>
                </ul>
              </div>
            </div>

            {userEmail && (
              <div style={{ 
                backgroundColor: '#e3f2fd', 
                border: '1px solid #2196f3', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '2rem' 
              }}>
                <p style={{ margin: 0, color: '#1976d2' }}>
                  <strong>We'll send the approval notification to:</strong> {userEmail}
                </p>
              </div>
            )}

            <button
              onClick={handleReturnHome}
              className="next-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                minWidth: '200px'
              }}
            >
              <MdHome size={20} />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPendingApproval;