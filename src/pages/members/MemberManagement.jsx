import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw,
  Plus,
  Upload,
  IndianRupee,
  Users,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import TableActions from '../../components/common/TableActions';
import ConfirmModal from '../../components/common/ConfirmModal';
import UploadBankStatementModal from '../../components/common/UploadBankStatementModal';
import MemberFiltersModal from '../../components/members/MemberFiltersModal';
import { useNavigate } from 'react-router-dom';
import '../../assets/dashboard.css';

// Mock Data matching the screenshot exactly
const mockMembers = [
  { id: 'M01', name: 'Rahul Patel', initials: 'RP', theme: 'blue', mobile: '9876543210', pg: 'Sunshine PG', room: '101', bed: 'A', rent: '6000.00', dueDate: '05-Aug-2024', rentStatus: 'Pending', memberStatus: 'Active' },
  { id: 'M02', name: 'Amit Sharma', initials: 'AS', theme: 'orange', mobile: '9123456780', pg: 'Green View PG', room: '202', bed: 'B', rent: '7500.00', dueDate: '01-Aug-2024', rentStatus: 'Overdue', memberStatus: 'Active' },
  { id: 'M03', name: 'Sahil Verma', initials: 'SV', theme: 'green', mobile: '9988776655', pg: 'Sunshine PG', room: '103', bed: 'A', rent: '6000.00', dueDate: '10-Aug-2024', rentStatus: 'Paid', memberStatus: 'Active' },
  { id: 'M04', name: 'Neha Singh', initials: 'NS', theme: 'purple', mobile: '8877665544', pg: 'Green View PG', room: '201', bed: 'A', rent: '7000.00', dueDate: '15-Aug-2024', rentStatus: 'Pending', memberStatus: 'Active' },
  { id: 'M05', name: 'Vikas Kumar', initials: 'VK', theme: 'orange', mobile: '7766554433', pg: 'Sunshine PG', room: '102', bed: 'B', rent: '6000.00', dueDate: '28-Jul-2024', rentStatus: 'Overdue', memberStatus: 'Active' },
  { id: 'M06', name: 'Pooja Mehta', initials: 'PM', theme: 'teal', mobile: '6655443322', pg: 'Green View PG', room: '203', bed: 'A', rent: '7500.00', dueDate: '12-Aug-2024', rentStatus: 'Paid', memberStatus: 'Active' },
  { id: 'M07', name: 'Rohan Das', initials: 'RD', theme: 'pink', mobile: '5544332211', pg: 'Sunshine PG', room: '104', bed: 'B', rent: '6500.00', dueDate: '25-Jul-2024', rentStatus: 'Overdue', memberStatus: 'Inactive' },
  { id: 'M08', name: 'Karan Joshi', initials: 'KJ', theme: 'blue', mobile: '4433221100', pg: 'Green View PG', room: '204', bed: 'B', rent: '7000.00', dueDate: '05-Aug-2024', rentStatus: 'Pending', memberStatus: 'Active' },
  { id: 'M09', name: 'Arpita Roy', initials: 'AR', theme: 'purple', mobile: '3322110099', pg: 'Sunshine PG', room: '105', bed: 'A', rent: '6000.00', dueDate: '18-Aug-2024', rentStatus: 'Paid', memberStatus: 'Inactive' },
  { id: 'M10', name: 'Medical Kumar', initials: 'MK', theme: 'teal', mobile: '2211009988', pg: 'Green View PG', room: '205', bed: 'A', rent: '7500.00', dueDate: '08-Aug-2024', rentStatus: 'Pending', memberStatus: 'Active' },
];

const MemberManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDeactivateClick = (member) => {
    setSelectedMember(member);
    setIsDeactivateModalOpen(true);
  };

  const confirmDeactivate = () => {
    console.log('Deactivated member:', selectedMember?.name);
    setIsDeactivateModalOpen(false);
  };

  const handleUploadSubmit = () => {
    console.log('Uploaded statement');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <span className="crumb-separator">{'>'}</span>
        <span className="crumb-link">Member Management</span>
        <span className="crumb-separator">{'>'}</span>
        <span className="crumb-current">Member List</span>
      </div>


      {/* Data Card */}
      <div className="data-card">
        {/* Toolbar */}
        <div className="data-toolbar">
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search by ID, Name, Mobile, PG, Room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <Button variant="outline-primary" icon={<Upload size={16} />} onClick={() => setIsUploadModalOpen(true)} title="Upload Bank Statement">
              <span className="hide-on-mobile">Upload Bank Statement</span>
            </Button>
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/member-management/add')} title="Add Member">
              <span className="hide-on-mobile">Add Member</span>
            </Button>
            <Button variant="outline" icon={<Filter size={16} />} onClick={() => setIsFilterModalOpen(true)}>Filters</Button>
            <Button variant="outline" icon={<RotateCcw size={16} />}>Reset</Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container list-table-container">
          <table className="data-table list-table">
            <thead>
              <tr>
                <th>ID <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Member <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Mobile <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>PG <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Room <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Bed <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Monthly Rent <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Due Date <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Rent Status <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Member Status <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockMembers.map((member) => (
                <tr key={member.id}>
                  <td className="font-medium text-slate-900">{member.id}</td>
                  <td>
                    <div className="member-cell">
                      <div className={`avatar-circle avatar-${member.theme}`}>
                        {member.initials}
                      </div>
                      <span className="font-medium text-slate-700">{member.name}</span>
                    </div>
                  </td>
                  <td>{member.mobile}</td>
                  <td>{member.pg}</td>
                  <td>{member.room}</td>
                  <td>{member.bed}</td>
                  <td>₹ {member.rent}</td>
                  <td>{member.dueDate}</td>
                  <td>
                    <span className={`badge-status-${member.rentStatus.toLowerCase()}`}>
                      {member.rentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status-${member.memberStatus.toLowerCase()}`}>
                      {member.memberStatus}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <TableActions 
                      customAction={
                        <button className="action-icon-btn verify-btn" title="Verify Payment">
                          <IndianRupee size={16} />
                        </button>
                      }
                      onView={() => navigate(`/member-management/view/${member.id}`)}
                      onEdit={() => navigate(`/member-management/edit/${member.id}`)}
                      onDelete={() => handleDeactivateClick(member)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-footer">
          <div className="pagination-controls">
            <div className="page-numbers">
              <button className="page-btn nav"><ChevronLeft size={16} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-dots">...</span>
              <button className="page-btn">13</button>
              <button className="page-btn nav"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Alert */}
      <div className="alert-box alert-info-blue" style={{ marginTop: '24px', padding: '16px 24px' }}>
        <Info size={20} />
        <span style={{ fontSize: '13px' }}>Verify action is enabled only when Rent Status is "In Review". Deactivate is disabled for members with status "Inactive".</span>
      </div>

      <ConfirmModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate Member"
        description={`Are you sure you want to deactivate ${selectedMember?.name}? This will change their status to Inactive.`}
        confirmText="Deactivate"
      />

      <UploadBankStatementModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSubmit}
      />

      <MemberFiltersModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};

export default MemberManagement;
