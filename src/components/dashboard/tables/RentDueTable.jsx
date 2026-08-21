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
              <th>PG & Room</th>
              <th>Rent</th>
              <th>Due Date</th>
              <th>Days Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item.rent_id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{getInitials(item.member_name)}</div>
                    <span>{item.member_name}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-stack">
                    <span className="cell-primary">{item.pg_name}</span>
                    <span className="cell-secondary">Room {item.room_number}</span>
                  </div>
                </td>
                <td><strong>{formatCurrency(item.rent_amount)}</strong></td>
                <td>{item.due_date}</td>
                <td>{item.days_left} Days</td>
                <td>
                  <span className={`status-badge status-${item.days_left === 0 ? 'red' : 'blue'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentDueTable;
