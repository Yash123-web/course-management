import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Trash2, Calendar } from 'lucide-react';
import { Course, CourseInstance } from '../types/course';
import { courseApi, instanceApi } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import SuccessMessage from '../components/UI/SuccessMessage';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [instances, setInstances] = useState<CourseInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [courseData, allInstances] = await Promise.all([
          courseApi.getCourse(id),
          instanceApi.getAllInstances()
        ]);

        if (!courseData) {
          setError('Course not found');
          return;
        }

        setCourse(courseData);
        setInstances(allInstances.filter(instance => instance.courseId === id));
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!course || !confirm(`Are you sure you want to delete course ${course.id}?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await courseApi.deleteCourse(course.id);
      setSuccess(`Course ${course.id} deleted successfully`);
      setTimeout(() => {
        navigate('/courses');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>
        <ErrorMessage message="Course not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Course Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{course.id}</h1>
                  <p className="text-lg text-gray-600">{course.title}</p>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

              {course.prerequisites.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Prerequisites</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {course.prerequisites.map((prereq) => (
                      <Link
                        key={prereq}
                        to={`/courses/${prereq}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {prereq}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Instances */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Course Instances</h2>
              <p className="text-sm text-gray-600">Scheduled deliveries of this course</p>
            </div>
            <Link
              to="/instances/create"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Instance
            </Link>
          </div>
        </div>
        
        <div className="px-6 py-6">
          {instances.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No instances scheduled for this course</p>
              <Link
                to="/instances/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Schedule First Instance
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {instances.map((instance) => (
                <div key={instance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {instance.year} • Semester {instance.semester}
                      </div>
                      <div className="text-sm text-gray-600">
                        Instance ID: {instance.id}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/instances/${instance.year}/${instance.semester}/${instance.courseId}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;