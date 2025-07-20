import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import TaskManagement from './pages/TaskManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <TaskManagement />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
