import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalBorrowings: 0,
    activeUsers: 0,
    recentActivity: []
  });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch platform statistics
      const [usersRes, itemsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/items')
      ]);

      setUsers(usersRes.data.users || []);
      setItems(itemsRes.data.items || []);
      
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalItems: itemsRes.data.items?.length || 0,
        totalBorrowings: 0, // Would come from borrowings API
        activeUsers: usersRes.data.users?.filter(u => 
          new Date() - new Date(u.lastActive) < 7 * 24 * 60 * 60 * 1000
        ).length || 0,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
    setLoading(false);
  };

  const handleUserAction = async (userId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const handleItemAction = async (itemId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/items/${itemId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action} item:`, error);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="page-admin page-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-admin page-container" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-admin page-container">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '30px' }}>Admin Dashboard</h2>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #ddd', 
        marginBottom: '30px' 
      }}>
        {['overview', 'users', 'items', 'reports'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
              color: activeTab === tab ? 'white' : '#666',
              cursor: 'pointer',
              textTransform: 'capitalize',
              borderRadius: '5px 5px 0 0'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>
                {stats.totalUsers}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>Total Users</p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#28a745' }}>
                {stats.totalItems}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>Total Items</p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#ffc107' }}>
                {stats.activeUsers}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>Active Users</p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#dc3545' }}>
                {stats.totalBorrowings}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>Transactions</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3>Recent Activity</h3>
            <p style={{ color: '#666' }}>Recent platform activity will be displayed here.</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>User Management</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Joined</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{user.name}</td>
                    <td style={{ padding: '10px' }}>{user.email}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        backgroundColor: user.isVerified ? '#d4edda' : '#f8d7da',
                        color: user.isVerified ? '#155724' : '#721c24'
                      }}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => handleUserAction(user._id, 'suspend')}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => handleUserAction(user._id, 'verify')}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Item Management</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {items.map(item => (
              <div
                key={item._id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0' }}>{item.name}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                  {item.description}
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem' }}>
                  Owner: {item.owner?.name}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleItemAction(item._id, 'approve')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleItemAction(item._id, 'remove')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Reports & Analytics</h3>
          <p style={{ color: '#666' }}>
            Platform analytics and reporting features will be implemented here.
          </p>
        </div>
      )}
    </div>
  </div>
  );
};

export default AdminDashboard;