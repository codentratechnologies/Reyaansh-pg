import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="page-wrapper">
      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        {/* brand */}
        <div className="brand">
          <img src="/logo.png" alt="Reyaansh Living PG Logo" className="brand-icon" style={{ width: '44px', height: '44px', objectFit: 'contain', transform: 'scale(1.2)', marginRight: '8px' }} />
          <div>
            <div className="brand-name">Reyaansh Living</div>
            <div className="brand-sub">PG</div>
          </div>
        </div>

        {/* decorations */}
        <div className="deco-dots"></div>
        <div className="deco-circle deco-circle-sm"></div>
        <div className="deco-circle deco-circle-lg"></div>

        {/* hero text */}
        <div className="hero-text">
          <h1 className="hero-title">
            Manage Your PG<br />
            With <span>Complete Control</span>
          </h1>
          <p className="hero-sub">
            Manage multiple PGs, rooms, members,<br />
            and rent collections seamlessly<br />
            from one secure dashboard.
          </p>
        </div>

        {/* building image */}
        <div className="building-wrap">
          <img src="/building.png" alt="PG Building" className="building-img" />
        </div>

        {/* trust badges */}
        <div className="badges">
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5.5V11C4 15.55 7.41 19.74 12 21C16.59 19.74 20 15.55 20 11V5.5L12 2Z" fill="#1a56db"/>
                <path d="M10 14.5L7.5 12L8.91 10.59L10 11.67L15.09 6.58L16.5 8L10 14.5Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="badge-title">256-bit Security</div>
              <div className="badge-desc">End-to-End Encryption</div>
            </div>
          </div>
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20V14H8V20H4ZM10 20V8H14V20H10ZM16 20V11H20V20H16Z" fill="#1a56db"/>
                <path d="M3 20H21" stroke="#1a56db" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="badge-title">100% Secure</div>
              <div className="badge-desc">24/7 Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right-panel">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
