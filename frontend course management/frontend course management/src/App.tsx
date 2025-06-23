import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseForm from './components/Course/CourseForm';
import InstancesPage from './pages/InstancesPage';
import InstanceDetailPage from './pages/InstanceDetailPage';
import InstanceForm from './components/Instance/InstanceForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/create" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="instances" element={<InstancesPage />} />
          <Route path="instances/create" element={<InstanceForm />} />
          <Route path="instances/:year/:semester/:courseId" element={<InstanceDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;