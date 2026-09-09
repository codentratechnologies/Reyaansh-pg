import React from 'react';

const getInitials = (name) => {
  if (!name) return 'UN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN')}`;

const RentDueTable = ({ data = [] }) => {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Upcoming Rent Due</h3>
      </div>
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>PG</th>
              <th>Room</th>
              <th>Rent</th>
              <th>Due Date</th>
              <th>Days Left</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b', fontSize: '14px' }}>
                  No upcoming rent dues at this time.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.rent_id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">{getInitials(item.member_name)}</div>
                      <span>{item.member_name}</span>
                    </div>
                  </td>
                  <td>{item.pg_name}</td>
                  <td>{item.room_number}</td>
                  <td><strong>{formatCurrency(item.rent_amount)}</strong></td>
                  <td>{item.due_date}</td>
                  <td>{item.days_left} Days</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-${item.days_left === 0 ? 'red' : 'blue'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentDueTable;
