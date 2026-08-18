import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="login-card">
      {/* envelope icon */}
      <div className="shield-wrap">
        <div className="shield-circle">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
            <path d="M12 20C12 17.7909 13.7909 16 16 16H48C50.2091 16 52 17.7909 52 20V42C52 44.2091 50.2091 46 48 46H16C13.7909 46 12 44.2091 12 42V20Z" fill="#a5c0f3" fillOpacity="0.6"/>
            <path d="M12 22L29.6 34.32C31.04 35.328 32.96 35.328 34.4 34.32L52 22" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="34" y="30" width="16" height="14" rx="2" fill="#1a56db"/>
            <path d="M38 30V26C38 23.7909 39.7909 22 42 22C44.2091 22 46 23.7909 46 26V30" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="42" cy="37" r="1.5" fill="white"/>
          </svg>
        </div>
      </div>

      <h2 className="card-title">Forgot Password?</h2>
      <p className="card-sub">
        Enter your registered email address and we'll<br/>
        send you a secure link to reset your password.
      </p>

      {/* form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label className="field-label">Email Address</label>
          <div className="input-wrap">
            <div className="input-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <input
              type="text"
              className="input input-with-box"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <button type="submit" className="login-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ marginRight: '8px' }}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send Reset Link
        </button>
      </form>

      <div className="or-divider">
        <span>OR</span>
      </div>

      <Link to="/" className="back-login">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Login
      </Link>

      <div className="secure-box">
        <div className="secure-box-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div className="secure-box-text">
          <div className="secure-box-title">Secure & Private</div>
          <div className="secure-box-desc">
            We never share your information with anyone.<br/>
            Reset link is valid for 15 minutes.
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="ssl">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          SSL Protected
        </div>
        <span className="sep">|</span>
        <span>Version 1.0</span>
      </div>
    </div>
  );
};

export default ForgotPassword;
