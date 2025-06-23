import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, BookOpen } from 'lucide-react';
import { Course, CreateCourseData } from '../../types/course';
import { courseApi } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';
import MultiSelect from '../UI/MultiSelect';

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  
  const [formData, setFormData] = useState<CreateCourseData>({
    id: '',
    title: '',
    description: '',
    prerequisites: []
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
      await courseApi.createCourse(formData);
      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const prerequisiteOptions = availableCourses
    .filter(course => course.id !== formData.id)
    .map(course => ({
      value: course.id,
      label: `${course.id} - ${course.title}`
    }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
              <p className="mt-1 text-sm text-gray-600">
                Add a new course to the system with comprehensive details and prerequisites.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-2">
                Course ID *
              </label>
              <input
                type="text"
                id="id"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., CS101, MATH201"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
              />
              <p className="mt-1 text-xs text-gray-500">Unique identifier for the course</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Introduction to Computer Programming"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
              <p className="mt-1 text-xs text-gray-500">Full name of the course</p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Provide a comprehensive description of what this course covers, learning objectives, and key topics..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <p className="mt-1 text-xs text-gray-500">Detailed description of course content and objectives</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prerequisites
            </label>
            <MultiSelect
              options={prerequisiteOptions}
              selected={formData.prerequisites}
              onChange={(selected) => setFormData(prev => ({ ...prev, prerequisites: selected }))}
              placeholder="Select prerequisite courses..."
              className="w-full"
            />
            <p className="mt-2 text-xs text-gray-500">
              Select courses that students must complete before taking this course. 
              {formData.prerequisites.length > 0 && (
                <span className="text-blue-600 font-medium">
                  {` ${formData.prerequisites.length} prerequisite${formData.prerequisites.length > 1 ? 's' : ''} selected.`}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/courses')}
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
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;