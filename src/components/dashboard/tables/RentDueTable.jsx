import React from 'react';

const upcomingRents = [
  { id: 1, initials: 'AK', name: 'Amit Kumar', pg: 'Sunrise PG', room: 'Room 101', rent: '₹12,000', dueDate: 'Today', daysLeft: '0', status: 'Due Today', statusColor: 'red' },
  { id: 2, initials: 'SJ', name: 'Sneha Joshi', pg: 'Lotus Villa', room: 'Room 205', rent: '₹15,500', dueDate: 'Aug 05', daysLeft: '3', status: 'Upcoming', statusColor: 'blue' },
  { id: 3, initials: 'RP', name: 'Rahul Patel', pg: 'Green View', room: 'Room 302', rent: '₹11,000', dueDate: 'Aug 10', daysLeft: '8', status: 'Upcoming', statusColor: 'blue' },
  { id: 4, initials: 'MS', name: 'Meera Sharma', pg: 'Oasis', room: 'Room 410', rent: '₹14,000', dueDate: 'Aug 12', daysLeft: '10', status: 'Upcoming', statusColor: 'blue' },
  { id: 5, initials: 'VS', name: 'Vikram Singh', pg: 'Park View', room: 'Room 505', rent: '₹13,500', dueDate: 'Aug 15', daysLeft: '13', status: 'Upcoming', statusColor: 'blue' },
];

const RentDueTable = () => {
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
            {upcomingRents.map((item) => (
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
                <td>{item.daysLeft}</td>
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

export default RentDueTable;
