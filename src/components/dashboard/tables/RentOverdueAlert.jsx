import React from 'react';

const overdueRents = [
  { id: 1, initials: 'AK', name: 'Amit Kumar', pg: 'Sunrise PG', room: 'Room 101', rent: '₹12,000', dueDate: 'Jul 05', overdueBy: '38 Days', status: 'Overdue', statusColor: 'red' },
  { id: 2, initials: 'SJ', name: 'Sneha Joshi', pg: 'Lotus Villa', room: 'Room 205', rent: '₹15,500', dueDate: 'Aug 01', overdueBy: '11 Days', status: 'Overdue', statusColor: 'red' },
  { id: 3, initials: 'RP', name: 'Rahul Patel', pg: 'Green View', room: 'Room 302', rent: '₹11,000', dueDate: 'Aug 05', overdueBy: '7 Days', status: 'Overdue', statusColor: 'orange' },
  { id: 4, initials: 'MS', name: 'Meera Sharma', pg: 'Oasis', room: 'Room 410', rent: '₹14,000', dueDate: 'Aug 10', overdueBy: '2 Days', status: 'Overdue', statusColor: 'orange' },
  { id: 5, initials: 'VS', name: 'Vikram Singh', pg: 'Park View', room: 'Room 505', rent: '₹13,500', dueDate: 'Aug 11', overdueBy: '1 Day', status: 'Overdue', statusColor: 'orange' },
];

const RentOverdueAlert = () => {
  return (
    <div className="table-card" style={{ borderColor: '#fecaca', background: '#fff5f5' }}>
      <div className="table-header">
        <h3 className="table-title" style={{ color: '#dc2626' }}>Alert: Rent Overdue</h3>
      </div>
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>PG & Room</th>
              <th>Rent</th>
              <th>Due Date</th>
              <th>Overdue By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {overdueRents.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{item.initials}</div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-stack">
                    <span className="cell-primary">{item.pg}</span>
                    <span className="cell-secondary">{item.room}</span>
                  </div>
                </td>
                <td><strong>{item.rent}</strong></td>
                <td>{item.dueDate}</td>
                <td style={{ color: '#dc2626', fontWeight: 600 }}>{item.overdueBy}</td>
                <td>
                  <span className={`status-badge status-${item.statusColor}`}>
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

export default RentOverdueAlert;
