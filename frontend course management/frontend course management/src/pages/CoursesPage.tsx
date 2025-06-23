import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookOpen, Filter } from 'lucide-react';
import { Course } from '../types/course';
import { courseApi } from '../services/api';
import CourseCard from '../components/Course/CourseCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import SuccessMessage from '../components/UI/SuccessMessage';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'entry' | 'advanced'>('all');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getAllCourses();
      setCourses(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    if (!confirm(`Are you sure you want to delete course ${courseId}?`)) {
      return;
    }

    try {
      setDeleteLoading(courseId);
      await courseApi.deleteCourse(courseId);
      setSuccess(`Course ${courseId} deleted successfully`);
      fetchCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const canDeleteCourse = (courseId: string) => {
    return !courses.some(course => course.prerequisites.includes(courseId));
  };

  const getDeleteReason = (courseId: string) => {
    const dependentCourses = courses.filter(course => course.prerequisites.includes(courseId));
    if (dependentCourses.length > 0) {
      return `This course is a prerequisite for: ${dependentCourses.map(c => c.id).join(', ')}`;
    }
    return '';
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'entry' && course.prerequisites.length === 0) ||
      (filterType === 'advanced' && course.prerequisites.length > 0);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage your course catalog with prerequisites and dependencies</p>
        </div>
        <Link
          to="/courses/create"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses by ID, title, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'entry' | 'advanced')}
            >
              <option value="all">All Courses</option>
              <option value="entry">Entry Level (No Prerequisites)</option>
              <option value="advanced">Advanced (Has Prerequisites)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'No courses found matching your criteria.' 
              : 'No courses available.'
            }
          </div>
          {!searchTerm && filterType === 'all' && (
            <Link
              to="/courses/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDelete}
              canDelete={canDeleteCourse(course.id)}
              deleteReason={getDeleteReason(course.id)}
              loading={deleteLoading === course.id}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-blue-800 font-medium">Total Courses</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {courses.filter(course => course.prerequisites.length === 0).length}
            </div>
            <div className="text-sm text-green-800 font-medium">Entry Level</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {courses.filter(course => course.prerequisites.length > 0).length}
            </div>
            <div className="text-sm text-purple-800 font-medium">Advanced</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {courses.filter(course => !canDeleteCourse(course.id)).length}
            </div>
            <div className="text-sm text-orange-800 font-medium">Prerequisites</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;