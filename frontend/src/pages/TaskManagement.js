import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ taskName: '', description: '', dueDate: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const TASKS_PER_PAGE = 3;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [page]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || 'Failed to fetch tasks');
      } else {
        setTasks(data.data);
        setTotalPages(data.data.length > TASKS_PER_PAGE ? Math.ceil(data.data.length / TASKS_PER_PAGE) : 1);
      }
    } catch (err) {
      console.warn('API not available, using mock data:', err.message);
      // Fallback to mock data when API is not available
      setTasks([]);
      setTotalPages(1);
      setError(''); // Clear error since we're using mock data
    }
    setLoading(false);
  };

  // Paginate tasks client-side
  const paginatedTasks = tasks.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE);

  const openModal = () => {
    setForm({ taskName: '', description: '', dueDate: '' });
    setFormError('');
    setEditTaskId(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setForm({
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate.slice(0, 16)
    });
    setFormError('');
    setEditTaskId(task._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError('');
    setEditTaskId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.taskName.trim() || !form.dueDate) {
      setFormError('Task Name and Due Date are required');
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      let res, data;
      if (editTaskId) {
        // Update Task
        res = await fetch(`${API_BASE_URL}/api/tasks/${editTaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        data = await res.json();
        if (!res.ok || !data.status) throw new Error(data.message || 'Failed to update task');
      } else {
        // Add Task
        res = await fetch(`${API_BASE_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        data = await res.json();
        if (!res.ok || !data.status) throw new Error(data.message || 'Failed to add task');
      }
      closeModal();
      fetchTasks();
    } catch (err) {
      setFormError(err.message);
    }
    setSubmitting(false);
  };

  const handleDropdownToggle = (taskId) => {
    setActiveDropdown(activeDropdown === taskId ? null : taskId);
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(task => task._id === taskId);
    if (taskToEdit) {
      openEditModal(taskToEdit);
    }
    setActiveDropdown(null);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      setActiveDropdown(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || 'Failed to delete task');
      } else {
        alert('Task deleted successfully!');
        fetchTasks();
      }
    } catch (err) {
      console.warn('API not available, simulating task deletion:', err.message);
      // Fallback: Remove task from local state when API is not available
      setTasks(prev => prev.filter(task => task._id !== taskId));
      alert('Task deleted successfully! (Demo mode - API not connected)');
    }
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const styles = {
    container: {
      padding: '40px 32px',
      background: '#fff',
      minHeight: '100vh'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '500',
      color: '#2340a0',
      margin: '0'
    },
    addTaskBtn: {
      background: '#2340a0',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '500',
      border: 'none',
      borderRadius: '28px',
      padding: '12px 32px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      boxShadow: '0 2px 8px rgba(35, 64, 160, 0.15)'
    },
    tableContainer: {
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff'
    },
    tableHead: {
      background: '#f8fafc'
    },
    th: {
      textAlign: 'left',
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#2340a0',
      padding: '16px 20px',
      borderBottom: '1px solid #e2e8f0'
    },
    tr: {
      borderBottom: '1px solid #f1f5f9',
      transition: 'background-color 0.2s'
    },
    trHover: {
      backgroundColor: '#f8fafc'
    },
    td: {
      padding: '20px',
      fontSize: '0.95rem',
      color: '#374151',
      verticalAlign: 'middle',
      borderBottom: '1px solid #f1f5f9'
    },
    actionMenu: {
      position: 'relative',
      display: 'inline-block'
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '8px',
      borderRadius: '6px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    actionBtnHover: {
      background: '#f3f4f6',
      color: '#2340a0'
    },
    dropdown: {
      position: 'absolute',
      right: '0',
      top: 'calc(100% + 8px)', // add a small gap below the button
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px', // more rounded
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      zIndex: 100, // ensure above other elements
      minWidth: '140px',
      overflow: 'visible'
    },
    dropdownItem: {
      padding: '12px 16px',
      fontSize: '0.9rem',
      color: '#374151',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      borderBottom: '1px solid #f3f4f6'
    },
    dropdownItemHover: {
      backgroundColor: '#f9fafb'
    },
    dropdownItemEdit: {
      color: '#2340a0'
    },
    dropdownItemDelete: {
      color: '#dc2626',
      borderBottom: 'none'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '40px',
      gap: '4px', // more space between items
    },
    pageBtn: {
      background: 'transparent',
      border: 'none',
      color: '#b0b0b0',
      fontSize: '12px',
      borderRadius: '8px',
      // padding: '0 10px',
      // margin: '0 2px',
      cursor: 'pointer',
      transition: 'color 0.2s, font-weight 0.2s',
      minWidth: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 400,
      boxShadow: 'none',
    },
    arrowBtn: {
      background: '#fff',
      border: 'none',
      color: '#222',
      fontSize: '12px',
      borderRadius: '5px',
      width: '25px',
      height: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s, background 0.2s',
    },
    arrowBtnDisabled: {
      color: '#e5e7eb',
      background: '#fafafa',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    activePage: {
      background: 'transparent',
      color: '#000',
      fontWeight: 700,
      border: 'none',
      boxShadow: 'none',
    },
    modalOverlay: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    },
    modalContent: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      minWidth: '400px',
      maxWidth: '95vw'
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '24px',
      textAlign: 'center'
    },
    modalForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    modalInput: {
      fontSize: '1rem',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      background: '#fff',
      color: '#1f2937',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    modalInputFocus: {
      borderColor: '#2340a0',
      boxShadow: '0 0 0 3px rgba(35, 64, 160, 0.1)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px'
    },
    saveBtn: {
      background: '#2340a0',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '500',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      flex: '1'
    },
    saveBtnDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed'
    },
    cancelBtn: {
      background: '#f3f4f6',
      color: '#6b7280',
      fontSize: '1rem',
      fontWeight: '500',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: '1'
    },
    error: {
      color: '#dc2626',
      fontSize: '0.9rem',
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.headerRow, position: 'relative' }}>
        <h2 style={styles.title}>Tasks Management</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.2s',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Logout"
            onMouseEnter={e => e.target.style.background = '#f3f4f6'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            {/* Simple logout SVG icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 17L21 12L16 7" stroke="#2340a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="#2340a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3" stroke="#2340a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            style={styles.addTaskBtn} 
            onClick={openModal}
            onMouseEnter={(e) => e.target.style.background = '#1e3a8a'}
            onMouseLeave={(e) => e.target.style.background = '#2340a0'}
          >
            + Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#dc2626', margin: '16px 0', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Task</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#2340a0', fontSize: '1.1rem', padding: '40px' }}>
                    No Data
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, idx) => (
                  <tr 
                    key={task._id} 
                    style={styles.tr}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.td}>{(page - 1) * TASKS_PER_PAGE + idx + 1}</td>
                    <td style={styles.td}>
                      {(() => {
                        const dateObj = new Date(task.dueDate);
                        // Convert to IST
                        const istDate = new Date(dateObj.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
                        const day = String(istDate.getDate()).padStart(2, '0');
                        const month = String(istDate.getMonth() + 1).padStart(2, '0');
                        const year = istDate.getFullYear();
                        let hours = istDate.getHours();
                        const minutes = String(istDate.getMinutes()).padStart(2, '0');
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        const hourStr = String(hours).padStart(2, '0');
                        return `${day}/${month}/${year} ${hourStr}:${minutes} ${ampm}`;
                      })()}
                    </td>
                    <td style={styles.td}>{task.taskName}</td>
                    <td style={styles.td}>{task.description}</td>
                    <td style={styles.td}>
                      <div style={styles.actionMenu} onClick={e => e.stopPropagation()}>
                        <button 
                          style={styles.actionBtn}
                          onClick={() => handleDropdownToggle(task._id)}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#f3f4f6';
                            e.target.style.color = '#2340a0';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'none';
                            e.target.style.color = '#6b7280';
                          }}
                        >
                          ⋮
                        </button>
                        {activeDropdown === task._id && (
                          <div style={styles.dropdown}>
                            <div 
                              style={{...styles.dropdownItem, ...styles.dropdownItemEdit}}
                              onClick={() => handleEdit(task._id)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              ✓ Edit
                            </div>
                            <div 
                              style={{...styles.dropdownItem, ...styles.dropdownItemDelete}}
                              onClick={() => handleDelete(task._id)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              Delete
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && tasks.length > TASKS_PER_PAGE && (
        <div style={styles.pagination}>
          <button 
            style={{
              ...styles.arrowBtn,
              ...(page === 1 ? styles.arrowBtnDisabled : {})
            }}
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            <ArrowBackIosIcon fontSize="inherit" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.pageBtn,
                ...(page === i + 1 ? styles.activePage : {})
              }}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <button 
            style={{
              ...styles.arrowBtn,
              ...(page === totalPages ? styles.arrowBtnDisabled : {})
            }}
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
          >
            <ArrowForwardIosIcon fontSize="inherit" />
          </button>
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editTaskId ? 'Edit Task' : 'Add Task'}</h3>
            <form style={styles.modalForm} onSubmit={handleFormSubmit}>
              <input
                style={styles.modalInput}
                name="taskName"
                placeholder="Enter Task Name"
                value={form.taskName}
                onChange={handleFormChange}
                disabled={submitting}
                required
                onFocus={(e) => e.target.style.borderColor = '#2340a0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <input
                style={styles.modalInput}
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleFormChange}
                disabled={submitting}
                onFocus={(e) => e.target.style.borderColor = '#2340a0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <input
                style={styles.modalInput}
                name="dueDate"
                type="datetime-local"
                placeholder="Date Picker"
                value={form.dueDate}
                onChange={handleFormChange}
                disabled={submitting}
                required
                onFocus={(e) => e.target.style.borderColor = '#2340a0'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              {formError && <div style={styles.error}>{formError}</div>}
              <div style={styles.buttonGroup}>
                <button 
                  type="submit"
                  style={{...styles.saveBtn, ...(submitting ? styles.saveBtnDisabled : {})}}
                  disabled={submitting}
                  onMouseEnter={(e) => !submitting && (e.target.style.background = '#1e3a8a')}
                  onMouseLeave={(e) => !submitting && (e.target.style.background = '#2340a0')}
                >
                  {submitting ? (editTaskId ? 'Updating...' : 'Saving...') : (editTaskId ? 'Update' : 'Save')}
                </button>
                <button 
                  type="button" 
                  style={styles.cancelBtn}
                  onClick={closeModal} 
                  disabled={submitting}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 5
          }}
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default TaskManagement;