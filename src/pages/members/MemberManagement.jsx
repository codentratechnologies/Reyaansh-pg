import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
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
import api from '../../utils/api';

const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];

const getTheme = (name) => {
  if (!name) return 'blue';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const MemberManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [memberToVerify, setMemberToVerify] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [activeFilters, setActiveFilters] = useState({
    pg_name: '', rent_status: '', gender: '', member_status: '', city: ''
  });

  // API State
  const [membersList, setMembersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_pages: 1,
    has_next: false,
    has_previous: false
  });

  const fetchMembers = async (page = 1, search = '', filters = activeFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/members', {
        params: {
          page: page,
          page_size: pagination.page_size,
          search: search,
          ...(filters.pg_name && { pg_name: filters.pg_name }),
          ...(filters.rent_status && { rent_status: filters.rent_status }),
          ...(filters.gender && { gender: filters.gender }),
          ...(filters.member_status && { member_status: filters.member_status }),
          ...(filters.city && { city: filters.city })
        }
      });
      if (response.data) {
        setMembersList(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Unknown error";
      setError(`Failed to load members. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers(1, searchTerm, activeFilters);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMembersList = React.useMemo(() => {
    let sortableItems = [...membersList];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        // Special handling for monthly_rent which might be string or number
        if (sortConfig.key === 'monthly_rent') {
           aValue = Number(aValue) || 0;
           bValue = Number(bValue) || 0;
        }

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [membersList, sortConfig]);

  const handlePageChange = (newPage) => {
    fetchMembers(newPage, searchTerm, activeFilters);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const handleDeactivateClick = (member) => {
    setSelectedMember(member);
    setIsDeactivateModalOpen(true);
  };

  const confirmDeactivate = async () => {
    if (!selectedMember) return;
    try {
      await api.delete('/api/members', { params: { member_id: selectedMember.id || selectedMember.member_id } });
      fetchMembers(pagination.current_page, searchTerm);
      setIsDeactivateModalOpen(false);
    } catch (err) {
      console.error('Failed to deactivate member:', err);
      const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
      setError(`Failed to deactivate member. Error: ${errorMessage}`);
      setIsDeactivateModalOpen(false);
    }
  };

  const handleVerifyClick = (member) => {
    if (member.rent_status === 'Pending') {
      setMemberToVerify(member);
      setIsVerifyModalOpen(true);
    }
  };

  const confirmVerify = async () => {
    if (!memberToVerify) return;
    try {
      await api.post('/api/members/verify-check', { member_id: memberToVerify.id || memberToVerify.member_id });
      fetchMembers(pagination.current_page, searchTerm, activeFilters);
      setIsVerifyModalOpen(false);
    } catch (err) {
      console.error('Failed to verify member payment:', err);
      const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
      setError(`Failed to verify payment. Error: ${errorMessage}`);
      setIsVerifyModalOpen(false);
    }
  };

  const handleUploadSubmit = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/api/upload-payment-statement/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded statement successfully');
      // fetchMembers(pagination.current_page, searchTerm, activeFilters); // Optional: refresh list
    } catch (err) {
      console.error('Failed to upload statement:', err);
      const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
      setError(`Failed to upload statement. Error: ${errorMessage}`);
    } finally {
      setIsUploadModalOpen(false);
    }
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

            <Button variant="outline" icon={<Filter size={16} />} onClick={() => setIsFilterModalOpen(true)} style={{ position: 'relative' }}>
              Filters
              {Object.values(activeFilters).some(v => v !== '') && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#3b82f6', width: '8px', height: '8px', borderRadius: '50%' }}></span>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', margin: '0 24px 16px 24px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="table-container list-table-container">
          <table className="data-table list-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Member <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('mobile')} style={{ cursor: 'pointer' }}>Mobile <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('pg_name')} style={{ cursor: 'pointer' }}>PG <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('room_number')} style={{ cursor: 'pointer' }}>Room <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('bed_name')} style={{ cursor: 'pointer' }}>Bed <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('monthly_rent')} style={{ cursor: 'pointer' }}>Monthly Rent <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('due_date')} style={{ cursor: 'pointer' }}>Due Date <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('rent_status')} style={{ textAlign: 'center', cursor: 'pointer' }}>Rent Status <ArrowUpDown size={12} className="sort-icon" /></th>
                <th onClick={() => handleSort('member_status')} style={{ textAlign: 'center', cursor: 'pointer' }}>Member Status <ArrowUpDown size={12} className="sort-icon" /></th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-8" style={{ color: '#64748b' }}>Loading members...</td>
                </tr>
              ) : membersList.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8" style={{ color: '#64748b' }}>No members found.</td>
                </tr>
              ) : (
                sortedMembersList.map((member, index) => {
                  const theme = getTheme(member.name);
                  const initials = getInitials(member.name);
                  const rentStatus = member.rent_status || 'Pending';
                  const memberStatus = member.member_status || 'Active';

                  return (
                    <tr key={member.id || index}>
                      <td className="font-medium text-slate-900">{member.id}</td>
                      <td>
                        <div className="member-cell">
                          <div className={`avatar-circle avatar-${theme}`}>
                            {initials}
                          </div>
                          <span className="font-medium text-slate-700">{member.name}</span>
                        </div>
                      </td>
                      <td>{member.mobile}</td>
                      <td>{member.pg_name}</td>
                      <td>{member.room_number}</td>
                      <td>{member.bed_name}</td>
                      <td>₹ {member.monthly_rent}</td>
                      <td>{member.due_date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge-status-${rentStatus.toLowerCase()}`}>
                          {rentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge-status-${memberStatus.toLowerCase().replace(' ', '-')}`}>
                          {memberStatus}
                        </span>
                      </td>
                      <td className="actions-cell" style={{ textAlign: 'center' }}>
                        <TableActions 
                          customAction={
                            <button 
                              className="action-icon-btn verify-btn" 
                              title={rentStatus === 'Pending' ? "Verify Cash Payment" : "Verification Unavailable"}
                              disabled={rentStatus !== 'Pending'}
                              onClick={() => handleVerifyClick(member)}
                              style={{ opacity: rentStatus !== 'Pending' ? 0.5 : 1, cursor: rentStatus !== 'Pending' ? 'not-allowed' : 'pointer' }}
                            >
                              <IndianRupee size={16} />
                            </button>
                          }
                          onView={() => navigate(`/member-management/view/${member.id}`)}
                          onEdit={() => navigate(`/member-management/edit/${member.id}`)}
                          onDelete={() => handleDeactivateClick(member)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-footer">
          <div className="pagination-controls">
            <div className="page-numbers">
              <button 
                className="page-btn nav" 
                disabled={!pagination.has_previous}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button className="page-btn active">{pagination.current_page}</button>
              
              {pagination.current_page < pagination.total_pages && (
                <button className="page-btn" onClick={() => handlePageChange(pagination.current_page + 1)}>
                  {pagination.current_page + 1}
                </button>
              )}
              
              {pagination.total_pages > pagination.current_page + 1 && (
                <span className="page-dots">...</span>
              )}
              
              <button 
                className="page-btn nav" 
                disabled={!pagination.has_next}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Alert */}
      <div className="alert-box alert-info-blue" style={{ marginTop: '24px', padding: '16px 24px' }}>
        <Info size={20} />
        <span style={{ fontSize: '13px' }}>Verify action is enabled only when Rent Status is "Pending" (for cash payments). Deactivate is disabled for members with status "Inactive".</span>
      </div>

      <ConfirmModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate Member"
        description={`Are you sure you want to deactivate ${selectedMember?.name}? This will change their status to Inactive.`}
        confirmText="Deactivate"
      />

      <ConfirmModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onConfirm={confirmVerify}
        title="Verify Payment"
        description={`Are you sure you want to verify the payment for ${memberToVerify?.name}?`}
        confirmText="Yes"
      />

      <UploadBankStatementModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSubmit}
      />

      <MemberFiltersModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default MemberManagement;
