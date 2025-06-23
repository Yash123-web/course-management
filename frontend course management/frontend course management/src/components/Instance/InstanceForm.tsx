import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Calendar } from 'lucide-react';
import { Course, CreateInstanceData } from '../../types/course';
import { courseApi, instanceApi } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';

const InstanceForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  
  const [formData, setFormData] = useState<CreateInstanceData>({
    courseId: '',
    year: new Date().getFullYear(),
    semester: 1
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await courseApi.getAllCourses();
        setAvailableCourses(courses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await instanceApi.createInstance(formData);
      setSuccess('Course instance created successfully!');
      setTimeout(() => {
        navigate('/instances');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const selectedCourse = availableCourses.find(course => course.id === formData.courseId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Course Instance</h1>
              <p className="mt-1 text-sm text-gray-600">
                Schedule a course delivery for a specific year and semester.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          <div>
            <label htmlFor="courseId" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course *
            </label>
            <select
              id="courseId"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.courseId}
              onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
            >
              <option value="">Choose a course to schedule...</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.title}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the course you want to schedule for delivery</p>
          </div>

          {selectedCourse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Selected Course Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Title:</span> {selectedCourse.title}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Description:</span> {selectedCourse.description}
                </p>
                {selectedCourse.prerequisites.length > 0 && (
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Prerequisites:</span> {selectedCourse.prerequisites.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year *
              </label>
              <select
                id="year"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Year when the course will be delivered</p>
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-semibold text-gray-700 mb-2">
                Semester *
              </label>
              <select
                id="semester"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
              >
                <option value={1}>Semester 1 (Fall)</option>
                <option value={2}>Semester 2 (Spring)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Semester when the course will be offered</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/instances')}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Instance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstanceForm;