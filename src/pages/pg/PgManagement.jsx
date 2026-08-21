import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import TableActions from '../../components/common/TableActions';
import PgFiltersModal from '../../components/pg/PgFiltersModal';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../assets/dashboard.css';

const PgManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedPg, setSelectedPg] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Filters State
  const [filters, setFilters] = useState({
    property_type: 'All',
    living_type: 'All',
    property_status: 'All',
    state: 'All States',
    city: 'All Cities'
  });
  
  // API State
  const [pgList, setPgList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
    total_pages: 1,
    has_next: false,
    has_prev: false
  });

  // Fetch PG Data
  const fetchPgs = async (page = 1, search = '', currentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: page,
        limit: pagination.limit,
        search: search
      };

      if (currentFilters.property_type !== 'All') params.property_type = currentFilters.property_type;
      if (currentFilters.living_type !== 'All') params.living_type = currentFilters.living_type;
      if (currentFilters.property_status !== 'All') params.property_status = currentFilters.property_status === 'Active' ? 'active' : 'inactive';
      if (currentFilters.city !== 'All Cities') params.city = currentFilters.city;
      if (currentFilters.state !== 'All States') params.state = currentFilters.state;

      const response = await api.get('/api/addpg/', { params });
      if (response.data) {
        setPgList(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching PGs:", err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to load PG properties. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and search fetch
  useEffect(() => {
    // Basic debounce for search
    const timer = setTimeout(() => {
      fetchPgs(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    fetchPgs(newPage, searchTerm, filters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
    fetchPgs(1, searchTerm, newFilters);
  };

  const handleDeactivateClick = (pg) => {
    setSelectedPg(pg);
    setIsDeactivateModalOpen(true);
  };

  const confirmDeactivate = async () => {
    if (!selectedPg) return;
    
    try {
      await api.delete('/api/addpg/', {
        params: { pg_id: selectedPg.pg_id }
      });
      // Refresh the list after successful deletion
      fetchPgs(pagination.current_page, searchTerm);
    } catch (err) {
      console.error("Error deactivating PG:", err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || "Unknown error";
      setError(`Failed to deactivate PG. Error: ${errorMessage}`);
    } finally {
      setIsDeactivateModalOpen(false);
      setSelectedPg(null);
    }
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-current">PG Management</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-link">List PG</span>
      </div>



      {/* Main Card */}
      <div className="data-card">
        {/* Toolbar */}
        <div className="data-toolbar">
          <div className="search-bar">
            <Search size={18} color="#94a3b8" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search PG by name, code or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="toolbar-actions">
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/pg-management/add')} title="Add New PG">
              <span className="hide-on-mobile">Add New PG</span>
            </Button>
            <Button variant="outline" icon={<Filter size={16} />} onClick={() => setIsFilterModalOpen(true)}>Filter</Button>
            <Button variant="outline" icon={<ArrowUpDown size={16} />}>Sort</Button>
            <Button variant="outline" icon={<RotateCcw size={16} />} onClick={() => { setSearchTerm(''); fetchPgs(1, ''); }}>Reset</Button>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', margin: '0 24px 16px 24px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="table-container list-table-container">
          <table className="data-table list-table">
            <thead>
              <tr>
                <th>Code <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>PG Name <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>PG Type <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Living Type <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Contact Person <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Mobile <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Status <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8" style={{ color: '#64748b' }}>Loading properties...</td>
                </tr>
              ) : pgList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8" style={{ color: '#64748b' }}>No properties found.</td>
                </tr>
              ) : (
                pgList.map((pg, index) => {
                  const initial = pg.contact_person ? pg.contact_person.charAt(0).toUpperCase() : 'U';
                  const isPg = pg.pg_type === 'PG';
                  const isActive = pg.status && pg.status.toLowerCase() === 'active';

                  return (
                    <tr key={pg.pg_id || index}>
                      <td className="font-semibold text-slate-800">{pg.pg_id}</td>
                      <td>
                        <div className="pg-name-cell">
                          <div className={`pg-icon-wrap ${isPg ? 'bg-blue-light' : 'bg-orange-light'}`}>
                            {/* Dummy icon for PG/Apartment */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isPg ? 'text-blue' : 'text-orange'}>
                              {isPg 
                                ? <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 7h6M9 11h6" />
                                : <path d="M3 21h18M9 21V9a2 2 0 012-2h2a2 2 0 012 2v12M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                              }
                            </svg>
                          </div>
                          <span className="font-semibold text-slate-800">{pg.pg_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${isPg ? 'type-pg' : 'type-apt'}`}>
                          {pg.pg_type}
                        </span>
                      </td>
                      <td className="text-slate-800 font-semibold">{pg.living_type}</td>
                      <td>
                        <div className="contact-cell">
                          <div className="contact-avatar-circle">{initial}</div>
                          <span className="font-semibold text-slate-800">{pg.contact_person}</span>
                        </div>
                      </td>
                      <td className="text-slate-800 font-semibold">{pg.mobile}</td>
                      <td>
                        <span className={`status-badge-outline ${isActive ? 'status-outline-green' : 'status-outline-red'}`} style={{ textTransform: 'capitalize' }}>
                          <span className="status-dot"></span>
                          {pg.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <TableActions 
                          onView={() => navigate(`/pg-management/view/${pg.pg_id}`)}
                          onEdit={() => navigate(`/pg-management/edit/${pg.pg_id}`)}
                          onDelete={() => handleDeactivateClick(pg)}
                          deleteTitle="Deactivate PG"
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
                disabled={!pagination.has_prev}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button className="page-btn active">{pagination.current_page}</button>
              {pagination.current_page < pagination.total_pages && (
                <button className="page-btn" onClick={() => handlePageChange(pagination.current_page + 1)}>{pagination.current_page + 1}</button>
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

      <ConfirmModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate PG"
        description={`Are you sure you want to deactivate ${selectedPg?.name}? This will hide it from active listings and prevent new bookings.`}
        confirmText="Deactivate"
      />

      {/* Filter Modal */}
      <PgFiltersModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default PgManagement;
