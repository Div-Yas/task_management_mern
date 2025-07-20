import React, { useState, useEffect } from 'react';
import styles from './TaskManagement.module.css';
import { API_BASE_URL } from '../constants';

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
        setError(data.message || 'Failed to fetch tasks');
        setTasks([]);
      } else {
        setTasks(data.data);
        setTotalPages(data.data.length > 5 ? Math.ceil(data.data.length / 5) : 1);
      }
    } catch (err) {
      setError('Server error');
      setTasks([]);
    }
    setLoading(false);
  };

  // Paginate tasks client-side for now
  const paginatedTasks = tasks.slice((page - 1) * 5, page * 5);

  const openModal = () => {
    setForm({ taskName: '', description: '', dueDate: '' });
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.taskName.trim() || !form.dueDate) {
      setFormError('Task Name and Due Date are required');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName: form.taskName,
          description: form.description,
          dueDate: form.dueDate,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.status) {
        setFormError(data.message || 'Failed to add task');
      } else {
        closeModal();
        alert('Task added successfully!');
        fetchTasks();
      }
    } catch (err) {
      setFormError('Server error');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Tasks Management</h2>
        <button className={styles.addTaskBtn} onClick={openModal}>+ Add Task</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: '#FF6B6B', margin: '16px 0' }}>{error}</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Date & Time</th>
              <th>Task</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#2340a0', fontSize: '1.1rem' }}>
                  No Data
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task, idx) => (
                <tr key={task._id}>
                  <td>{(page - 1) * 5 + idx + 1}</td>
                  <td>{new Date(task.dueDate).toLocaleString('en-GB')}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td>
                    <div className={styles.actionMenu}>
                      <button className={styles.actionBtn}>⋮</button>
                      {/* Dropdown for Edit/Delete will go here */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {/* Show pagination only if more than 5 tasks and no error/loading */}
      {!loading && !error && tasks.length > 5 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? styles.activePageBtn : styles.pageBtn}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Add Task</h3>
            <form onSubmit={handleAddTask} className={styles.modalForm}>
              <input
                className={styles.modalInput}
                name="taskName"
                placeholder="Enter Task Name"
                value={form.taskName}
                onChange={handleFormChange}
                disabled={submitting}
                required
              />
              <input
                className={styles.modalInput}
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleFormChange}
                disabled={submitting}
              />
              <input
                className={styles.modalInput}
                name="dueDate"
                type="datetime-local"
                placeholder="Date Picker"
                value={form.dueDate}
                onChange={handleFormChange}
                disabled={submitting}
                required
              />
              {formError && <div style={{ color: '#FF6B6B', marginBottom: 8 }}>{formError}</div>}
              <button type="submit" className={styles.saveBtn} disabled={submitting}>Save</button>
              <button type="button" className={styles.cancelBtn} onClick={closeModal} disabled={submitting}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement; 