import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ChevronRight, 
  ArrowLeft,
  MapPin,
  Building2,
  ListChecks,
  CheckCircle2,
  XCircle,
  Edit2,
  Lock,
  Info,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Tv,
  Brush,
  Droplet,
  Camera,
  UtensilsCrossed,
  Wind,
  Car,
  ChefHat,
  Snowflake,
  Monitor
} from 'lucide-react';
import Button from '../../components/common/Button';
import '../../assets/dashboard.css';

const ViewPg = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pgData, setPgData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPgData = async () => {
      try {
        const response = await api.get(`/api/addpg/`, { params: { pg_id: id } });
        const data = response.data;
        const pg = Array.isArray(data.data) ? data.data[0] : (data.data || data);

        if (pg) {
          let rooms = [];
          if (pg.rooms && typeof pg.rooms === 'object' && !Array.isArray(pg.rooms)) {
            rooms = Object.values(pg.rooms).map(r => ({
              roomNo: r.room_number || '',
              sharing: r.sharing || '',
              rent: r.rent || '',
              bhk: r.bhk || ''
            }));
          } else if (pg.room_config && Array.isArray(pg.room_config)) {
            rooms = pg.room_config.map(r => ({
              roomNo: r.room_number || '',
              sharing: r.sharing || '',
              rent: r.rent || '',
              bhk: r.bhk || ''
            }));
          }

          setPgData({
            code: pg.pg_id || id,
            name: pg.name || pg.pg_name || '',
            type: pg.pg_type || 'PG',
            gender: pg.living_type || 'Boys',
            contact: pg.contact_person || '',
            mobile: pg.mobile || '',
            description: pg.description || '',
            status: pg.property_status === false ? 'Inactive' : 'Active',
            address1: pg.address_line_1 || '',
            address2: pg.address_line_2 || '',
            area: pg.area || '',
            landmark: pg.landmark || '',
            city: pg.city || '',
            state: pg.state || '',
            pincode: pg.pincode || '',
            country: pg.country || 'IN',
            rooms: pg.no_of_rooms || rooms.length,
            amenities: pg.amenities || [],
            roomList: rooms
          });
        }
      } catch (err) {
        console.error("Failed to fetch PG data:", err);
        setError("Failed to load PG details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPgData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #e0e7ff', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Loading property details...</span>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !pgData) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <XCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>{error || 'PG Not Found'}</h2>
        <Button variant="primary" onClick={() => navigate('/pg-management')}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-link">PG Management</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-current">View PG Details</span>
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon={<ArrowLeft size={16} />} className="add-pg-btn" onClick={() => navigate('/pg-management')} title="Back to List">
            <span className="hide-on-mobile">Back to List</span>
          </Button>
          <Button variant="primary" icon={<Edit2 size={16} />} className="add-pg-btn" onClick={() => navigate(`/pg-management/edit/${pgData.code}`)} title="Edit PG">
            <span className="hide-on-mobile">Edit PG</span>
          </Button>
        </div>
      </div>

      {/* Top Alert */}
      {pgData.status === 'Active' ? (
        <div className="alert-box alert-success">
          <ShieldCheck size={20} />
          <span>This property is currently active and operational.</span>
          <div className="alert-badge">
            <div style={{width: 6, height: 6, borderRadius: '50%', background: '#16a34a'}}></div>
            ACTIVE
          </div>
        </div>
      ) : (
        <div className="alert-box" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
          <ShieldAlert size={20} />
          <span>This property is currently marked as inactive.</span>
          <div className="alert-badge" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <div style={{width: 6, height: 6, borderRadius: '50%', background: '#ef4444'}}></div>
            INACTIVE
          </div>
        </div>
      )}

      {/* Basic Information Card */}
      <div className="form-section-card theme-blue">
        <div className="form-section-header">
          <div className="form-section-icon bg-blue">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Basic Information</h2>
            <p className="form-section-subtitle">General details of the property.</p>
          </div>
        </div>
        <div className="form-section-body">
          <div className="basic-info-layout">
            <div className="basic-info-left">
              <div className="pg-logo-large">
                <Building2 size={40} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{pgData.name}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge-pg">{pgData.type}</span>
                </div>
                <div className="kv-grid" style={{ gap: '8px', marginTop: '4px' }}>
                  <div className="kv-row" style={{ gridTemplateColumns: '100px 10px 1fr' }}>
                    <span className="kv-label">Code / ID</span>
                    <span className="kv-colon"></span>
                    <span className="kv-value"><span className="badge-code">{pgData.code}</span></span>
                  </div>
                  <div className="kv-row" style={{ gridTemplateColumns: '100px 10px 1fr' }}>
                    <span className="kv-label">Contact Person</span>
                    <span className="kv-colon"></span>
                    <span className="kv-value">{pgData.contact}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="basic-info-right">
              <div className="kv-grid">
                <div className="kv-row">
                  <span className="kv-label">Living Type</span>
                  <span className="kv-colon">:</span>
                  <span className="kv-value">{pgData.gender}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-label">Mobile</span>
                  <span className="kv-colon">:</span>
                  <span className="kv-value">{pgData.mobile}</span>
                </div>
                <div className="kv-row">
                  <span className="kv-label">Description</span>
                  <span className="kv-colon">:</span>
                  <span className="kv-value">{pgData.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="form-grid-2">
        {/* Address Information Card */}
        <div className="form-section-card theme-green" style={{ margin: 0 }}>
          <div className="form-section-header">
            <div className="form-section-icon bg-green">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Address Information</h2>
              <p className="form-section-subtitle">Location details of the property.</p>
            </div>
          </div>
          <div className="form-section-body">
            <div className="kv-grid">
              <div className="kv-row">
                <span className="kv-label">Address Line 1</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.address1}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Address Line 2</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.address2}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Area</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.area}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Landmark</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.landmark}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">City</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.city}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">State</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.state}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Pincode</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.pincode}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Country</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">🇮🇳 {pgData.country}</span>
              </div>
            </div>
            <div className="alert-box alert-info-blue no-margin" style={{ marginTop: '16px' }}>
              <Info size={16} />
              <span>All address details are for reference only.</span>
            </div>
          </div>
        </div>

        {/* Property Configuration Card */}
        <div className="form-section-card theme-purple" style={{ margin: 0 }}>
          <div className="form-section-header">
            <div className="form-section-icon bg-purple">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Property Configuration</h2>
              <p className="form-section-subtitle">Capacity and pricing details.</p>
            </div>
          </div>
          <div className="form-section-body">
            <div className="kv-grid">
              <div className="kv-row">
                <span className="kv-label">No. of Rooms / Flats</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">{pgData.rooms}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Property Status</span>
                <span className="kv-colon">:</span>
                <span className="kv-value">
                  {pgData.status === 'Active' ? (
                    <span className="badge-status-active">Active</span>
                  ) : (
                    <span className="badge-status-inactive" style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Inactive</span>
                  )}
                </span>
              </div>
            </div>
            <div className="alert-box alert-info-purple no-margin" style={{ marginTop: '16px' }}>
              <Info size={16} />
              <span>Configuration details define the capacity and pricing for this property.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Configuration Card */}
      <div className="form-section-card" style={{ borderColor: '#c7d2fe', marginTop: '24px' }}>
        <div className="form-section-header" style={{ background: '#eef2ff' }}>
          <div className="form-section-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="form-section-title">{pgData.type === 'Apartment' ? 'Flat Configuration' : 'Room Configuration'}</h2>
            <p className="form-section-subtitle">Details of configured {pgData.type === 'Apartment' ? 'flats' : 'rooms'} in this property.</p>
          </div>
        </div>
        <div className="form-section-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>#</th>
                  <th style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{pgData.type === 'Apartment' ? 'Flat No.' : 'Room Number'}</th>
                  <th style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{pgData.type === 'Apartment' ? 'BHK' : 'Sharing Capacity'}</th>
                  <th style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{pgData.type === 'Apartment' ? 'Rent' : 'Rent / Bed'}</th>
                </tr>
              </thead>
              <tbody>
                {pgData.roomList.map((room, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                      {room.roomNo}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px' }}>
                          {room.bhk || room.sharing}
                        </div>
                        {pgData.type !== 'Apartment' && <span>{room.sharing > 1 ? 'Persons' : 'Person'}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>
                      ₹{room.rent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Amenities Card */}
      <div className="form-section-card theme-orange">
        <div className="form-section-header">
          <div className="form-section-icon bg-orange">
            <ListChecks size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Amenities</h2>
            <p className="form-section-subtitle">All available amenities at this property.</p>
          </div>
        </div>
        <div className="form-section-body">
          <div className="form-grid-4">
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Wifi size={18} /></span> WiFi</div>
              {pgData.amenities.includes('WiFi') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Droplet size={18} /></span> RO Water</div>
              {pgData.amenities.includes('RO Water') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Wind size={18} /></span> Washing Machine</div>
              {pgData.amenities.includes('Washing Machine') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Snowflake size={18} /></span> Refrigerator</div>
              {pgData.amenities.includes('Refrigerator') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Monitor size={18} /></span> TV</div>
              {pgData.amenities.includes('TV') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Camera size={18} /></span> CCTV</div>
              {pgData.amenities.includes('CCTV') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Car size={18} /></span> Parking</div>
              {pgData.amenities.includes('Parking') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><ArrowLeft size={18} style={{transform:'rotate(90deg)'}} /></span> Lift</div>
              {pgData.amenities.includes('Lift') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Brush size={18} /></span> House Keeping</div>
              {pgData.amenities.includes('House Keeping') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><UtensilsCrossed size={18} /></span> Food</div>
              {pgData.amenities.includes('Food') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><ChefHat size={18} /></span> Kitchen Staff</div>
              {pgData.amenities.includes('Kitchen Staff') ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
          </div>
          <div className="alert-box alert-info-orange no-margin" style={{ marginTop: '16px' }}>
            <Info size={16} />
            <span>Only selected amenities are shown above.</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="view-footer">
        <Lock size={14} />
        This is a read-only view. To make changes, click Edit PG.
      </div>

    </div>
  );
};

export default ViewPg;
