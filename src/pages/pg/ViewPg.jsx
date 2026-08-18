import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  // In a real app, you would fetch data using this ID. 
  // Using static mock data based on the design for now.
  const pgData = {
    code: id || 'P001',
    name: 'Sai PG',
    type: 'PG',
    gender: 'Male',
    contact: 'Ravi Kumar',
    mobile: '9876543210',
    description: 'Near main market',
    status: 'Active',
    address1: 'Plot 42, Sector 1',
    address2: 'Opposite Park',
    area: 'Koramangala',
    landmark: 'Near Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    country: 'India',
    rooms: 20,
    sharing: 2,
    rent: '8,500.00',
    amenities: {
      wifi: true,
      water: true,
      washing: true,
      refrigerator: false,
      tv: true,
      cctv: true,
      parking: true,
      lift: false,
      housekeeping: true,
      food: true,
      staff: false
    },
    roomList: [
      { roomNo: 'A-101', sharing: 2, rent: '8500.00' },
      { roomNo: 'A-102', sharing: 1, rent: '12000.00' },
      { roomNo: 'A-103', sharing: 3, rent: '6500.00' },
    ]
  };

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
      <div className="alert-box alert-success">
        <ShieldCheck size={20} />
        <span>This property is currently active and operational.</span>
        <div className="alert-badge">
          <div style={{width: 6, height: 6, borderRadius: '50%', background: '#16a34a'}}></div>
          ACTIVE
        </div>
      </div>

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
                  <span className="kv-label">Gender Type</span>
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
                <span className="kv-value"><span className="badge-status-active">Active</span></span>
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
              {pgData.amenities.wifi ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Droplet size={18} /></span> RO Water</div>
              {pgData.amenities.water ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Wind size={18} /></span> Washing Machine</div>
              {pgData.amenities.washing ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Snowflake size={18} /></span> Refrigerator</div>
              {pgData.amenities.refrigerator ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Monitor size={18} /></span> TV</div>
              {pgData.amenities.tv ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Camera size={18} /></span> CCTV</div>
              {pgData.amenities.cctv ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Car size={18} /></span> Parking</div>
              {pgData.amenities.parking ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><ArrowLeft size={18} style={{transform:'rotate(90deg)'}} /></span> Lift</div>
              {pgData.amenities.lift ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><Brush size={18} /></span> House Keeping</div>
              {pgData.amenities.housekeeping ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><UtensilsCrossed size={18} /></span> Food</div>
              {pgData.amenities.food ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
            </div>
            <div className="view-amenity">
              <div className="view-amenity-left"><span className="view-amenity-icon"><ChefHat size={18} /></span> Kitchen Staff</div>
              {pgData.amenities.staff ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#ef4444" />}
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
