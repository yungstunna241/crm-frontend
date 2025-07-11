import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { Phone, BarChart2, Users, Search, FileText, Settings, Plus, Bell, HelpCircle, Clock3, User, Home, Menu, ChevronRight, CircleUserRound, Calendar } from 'lucide-react';

const PhoneIcon = () => (
  <svg width="16" height="16" fill="#2980b9" viewBox="0 0 24 24">
    <path d="M6.62 10.79a15.47 15.47 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.4 11.4 0 003.58.57 1 1 0 011 1v3.5a1 1 0 01-1 1A16 16 0 013 6a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.58 1 1 0 01-.21 1.11l-2.24 2.1z" />
  </svg>
);

export default function MainApp() {
const [activePage, setActivePage] = useState('calls');
const [contacts, setContacts] = useState([]);
const [statusFilter, setStatusFilter] = useState('');
const [countryFilter, setCountryFilter] = useState('');         // ✅ keep only one
const [showKYC, setShowKYC] = useState(false);
const [currentContact, setCurrentContact] = useState(null);
const [kycInput, setKycInput] = useState('');

const agentName = localStorage.getItem('role') || 'Agent';

const updateStatus = (id, newStatus) => {
  axios.post(`https://crm-backend-1-2mb5.onrender.com/contacts/${id}/update`, { result: newStatus })
    .then(() => {
      setContacts(prev => prev.map(c => c._id === id ? { ...c, result: newStatus } : c));
    })
    .catch(() => alert('Failed to update status'));
};

useEffect(() => {
  axios.get('https://crm-backend-1-2mb5.onrender.com')
    .then(res => setContacts(res.data))
    .catch(() => alert('Cannot reach backend'));
}, []);
const filteredContacts = contacts.filter(c => {
  const statusMatch =
    (statusFilter === 'All Types') ||
    (statusFilter === '' && (!c.result || c.result === '' || c.result === 'Select')) ||
    (c.result && c.result.toLowerCase() === statusFilter.toLowerCase());

  const countryMatch =
    !countryFilter ||
    (c.country && c.country.toLowerCase() === countryFilter.toLowerCase());

  return statusMatch && countryMatch;
});

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>

      <nav style={{ width: 220, backgroundColor: '#1C2A35', color: '#fff', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#ccc', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <CircleUserRound size={80} color="#555" />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 13 }}>{agentName}</div>
          <div style={{ fontSize: 11, color: '#00C853' }}>ACTIVE</div>
        </div>

        <input placeholder="Search by document ID..." style={{ margin: '0 10px 10px', padding: '8px', borderRadius: '4px', border: 'none', width: 'calc(100% - 20px)' }} />

        <div style={{ fontSize: 10, color: '#bbb', padding: '0 20px', marginBottom: 10 }}>Navigation</div>

        {[{ id: 'calls', label: 'Calls', icon: <Phone size={16} style={{ marginRight: 10 }} />, hasArrow: true }, { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={16} style={{ marginRight: 10 }} />, hasArrow: false }, { id: 'clients', label: 'Clients', icon: <Users size={16} style={{ marginRight: 10 }} />, hasArrow: true }, { id: 'search', label: 'Search', icon: <Search size={16} style={{ marginRight: 10 }} />, hasArrow: true }, { id: 'docs', label: 'Documents', icon: <FileText size={16} style={{ marginRight: 10 }} />, hasArrow: true }, { id: 'settings', label: 'Settings', icon: <Settings size={16} style={{ marginRight: 10 }} />, hasArrow: true }].map(({ id, label, icon, hasArrow }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            style={{ background: activePage === id ? '#253544' : 'transparent', border: 'none', color: '#fff', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon} {label}</span>
            {hasArrow && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <main style={{ flex: 1, backgroundColor: '#ECF0F1', display: 'flex', flexDirection: 'column' }}>

        <header style={{ backgroundColor: '#4B3F72', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', height: 50 }}>
          <Menu size={20} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Plus size={18} style={{ cursor: 'pointer' }} />
            <Bell size={18} style={{ cursor: 'pointer' }} />
            <HelpCircle size={18} style={{ cursor: 'pointer' }} />
            <div style={{ cursor: 'pointer' }}>
              <img src="https://flagcdn.com/w40/gb.png" alt="UK" style={{ width: 22, borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CircleUserRound size={24} color="#fff" />
              <div style={{ fontWeight: 'bold', fontSize: 13 }}>{agentName}</div>
            </div>
          </div>
        </header>

        <div style={{ paddingTop: 10 }}>

          <div style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, color: '#555' }}>
            <Home size={14} /> <span>Home</span> <span style={{ color: '#888' }}>&gt;</span> <span>Calls / SMS / Mail</span>
          </div>

          <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>

            {activePage === 'calls' && (
              <div>

                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                  {[{ label: 'CALLS TODAY', value: contacts.length, color: '#3498db' }, { label: 'SUCCESSFUL', value: '--', color: '#2ecc71' }, { label: 'FAILED', value: '--', color: '#e67e22' }, { label: 'MISSED', value: '--', color: '#c0392b' }].map((box, i) => (
                    <div key={i} style={{ background: box.color, color: '#fff', padding: 15, borderRadius: 5, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 12 }}>{box.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 'bold' }}>{box.value}</div>
                      </div>
                      <Clock3 size={30} />
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', borderRadius: 5, padding: 15, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ position: 'relative', flex: '1 1 120px' }}>
                    <input placeholder="Date From" style={{ padding: '8px 8px 8px 8px', border: '1px solid #ccc', borderRadius: 4, width: '100%', textAlign: 'left' }} />
                    <Calendar size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                  </div>
                  <div style={{ position: 'relative', flex: '1 1 120px' }}>
                    <input placeholder="Date To" style={{ padding: '8px 8px 8px 8px', border: '1px solid #ccc', borderRadius: 4, width: '100%', textAlign: 'left' }} />
                    <Calendar size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                  </div>
                  <div style={{ position: 'relative', flex: '1 1 120px' }}>
                    <input placeholder="Phone" style={{ padding: '8px 8px 8px 8px', border: '1px solid #ccc', borderRadius: 4, width: '100%', textAlign: 'left' }} />
                    <Phone size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                  </div>
                  <div style={{ position: 'relative', flex: '1 1 120px' }}>
                    <input placeholder="Client" style={{ padding: '8px 8px 8px 8px', border: '1px solid #ccc', borderRadius: 4, width: '100%', textAlign: 'left' }} />
                    <Users size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                  </div>
                  
                  <select
  value={countryFilter}
  onChange={(e) => setCountryFilter(e.target.value)}
  style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, flex: '1 1 120px' }}
>
  <option value="">All Countries</option>
  <option value="Australia">Australia</option>
  <option value="Canada">Canada</option>
  <option value="UK">UK</option>
  <option value="Belgium">Belgium</option>
  <option value="Netherlands">Netherlands</option>
</select>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, flex: '1 1 120px' }}
>
  <option value="">Select</option>
  <option value="All Types">All Types</option>
  <option value="No Answer">No Answer</option>
  <option value="Not In Service">Not In Service</option>
  <option value="Callback">Callback</option>
  <option value="Transfer">Transfer</option>
  <option value="Wrong Language">Wrong Language</option>
  <option value="Not Interested">Not Interested</option>
</select>
                  <button style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Search</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <ChevronRight size={14} style={{ color: '#fff', backgroundColor: '#27ae60', borderRadius: 2, padding: 2 }} />
                  <div style={{ fontSize: 12, color: '#333' }}>Found 15 out of 660</div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 5, overflow: 'hidden' }}>
  <thead style={{ backgroundColor: '#2C3E50', color: '#fff' }}>
  <tr>
    <th style={{ padding: 12 }}>Name</th>
    <th style={{ padding: 12 }}>Email</th>
    <th style={{ padding: 12 }}>Country</th>
    <th style={{ padding: 12 }}>Source</th>
    <th style={{ padding: 12 }}>Date</th>
    <th style={{ padding: 12 }}>Responsible</th>
    <th style={{ padding: 12 }}>Status</th>
    <th style={{ padding: 12 }}>Call</th>
    <th style={{ padding: 12 }}>KYC</th>
  </tr>
</thead>
  <tbody>
  {filteredContacts.map((c, index) => (
      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
        <td style={{ padding: 12 }}>{c.name || 'N/A'}</td>
        <td style={{ padding: 12 }}>{c.email || 'N/A'}</td>
        <td style={{ padding: 12 }}>{c.country || 'N/A'}</td>
        <td style={{ padding: 12 }}>{c.source || 'N/A'}</td>
        <td style={{ padding: 12 }}>{c.date ? new Date(c.date).toLocaleDateString() : 'N/A'}</td>
        <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
          <User size={14} /> {localStorage.getItem('role') || 'Agent'}
        </td>
        <td style={{ padding: 12 }}>
  <select
    value={c.result || ''}
    onChange={(e) => updateStatus(c._id, e.target.value)}
    style={{ padding: '4px 8px', borderRadius: 4 }}
  >
    <option value="">Select</option>
    <option value="No Answer">No Answer</option>
    <option value="Not In Service">Not In Service</option>
    <option value="Callback">Callback</option>
    <option value="Transfer">Transfer</option>
    <option value="Wrong Language">Wrong Language</option>
    <option value="Not Interested">Not Interested</option>
  </select>
</td>
        <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PhoneIcon /> {c.number || 'N/A'}
          <button
            onClick={() => window.location.href = `tel:${c.number}`}
            style={{
              backgroundColor: '#27ae60',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Phone size={12} color="#fff" />
          </button>
        </td>
        <td style={{ padding: 12 }}>
  <button
    onClick={() => {
      setCurrentContact(c);
      setKycInput(c.kyc || '');
      setShowKYC(true);
    }}
    style={{
      backgroundColor: '#f09610ff',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '4px 8px',
      cursor: 'pointer',
      fontSize: 12
    }}
  >
    KYC
  </button>
</td>

      </tr>
    ))}
</tbody>
</table>

              </div>
            )}

            {activePage === 'dashboard' && (
              <Dashboard contacts={contacts} />
            )}

          </div>

        </div>
{showKYC && currentContact && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 300 }}>
      <h3 style={{ marginBottom: 10 }}>Enter KYC</h3>
      <input
        type="text"
        value={kycInput}
        onChange={e => setKycInput(e.target.value)}
        placeholder="Enter KYC info"
        style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={() => setShowKYC(false)} style={{ padding: '6px 12px', border: 'none', background: '#ccc', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
        <button
          onClick={() => {
            const agent = localStorage.getItem('role') || 'Agent';
            axios.post(`https://crm-backend-1-2mb5.onrender.com/contacts/${currentContact._id}/update`, { kyc: `${kycInput} (by ${agent})` })
              .then(() => {
                setContacts(prev => prev.map(c => c._id === currentContact._id ? { ...c, kyc: `${kycInput} (by ${agent})` } : c));
                setShowKYC(false);
              })
              .catch(() => alert('Failed to save KYC'));
          }}
          style={{ padding: '6px 12px', border: 'none', background: '#2980b9', color: '#fff', borderRadius: 4, cursor: 'pointer' }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
