import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, Trash2 } from 'lucide-react';
import { CourseInstance } from '../types/course';
import { instanceApi } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import SuccessMessage from '../components/UI/SuccessMessage';

const InstanceDetailPage: React.FC = () => {
  const { year, semester, courseId } = useParams<{ 
    year: string; 
    semester: string; 
    courseId: string; 
  }>();
  const navigate = useNavigate();
  
  const [instance, setInstance] = useState<CourseInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchInstance = async () => {
      if (!year || !semester || !courseId) return;

      try {
        setLoading(true);
        const data = await instanceApi.getInstance(
          parseInt(year), 
          parseInt(semester), 
          courseId
        );
        
        if (!data) {
          setError('Course instance not found');
          return;
        }

        setInstance(data);
      } catch (err) {
        setError('Failed to fetch instance details');
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [year, semester, courseId]);

  const handleDelete = async () => {
    if (!instance || !confirm('Are you sure you want to delete this course instance?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await instanceApi.deleteInstance(instance.year, instance.semester, instance.courseId);
      setSuccess('Course instance deleted successfully');
      setTimeout(() => {
        navigate('/instances');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete instance');
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

  if (!instance) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/instances"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Instances
          </Link>
        </div>
        <ErrorMessage message="Course instance not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/instances"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instances
        </Link>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Instance Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {instance.year} • Semester {instance.semester}
                  </h1>
                  <p className="text-lg text-gray-600">Course Instance Details</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Instance ID</div>
                    <div className="text-lg font-semibold text-gray-900">{instance.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Year</div>
                    <div className="text-lg font-semibold text-gray-900">{instance.year}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Semester</div>
                    <div className="text-lg font-semibold text-gray-900">{instance.semester}</div>
                  </div>
                </div>
              </div>

              {instance.course && (
                <div>
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Course Information</h2>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="mb-4">
                      <div className="flex items-center">
                        <h3 className="text-2xl font-bold text-blue-900 mr-4">
                          {instance.course.id}
                        </h3>
                        <Link
                          to={`/courses/${instance.course.id}`}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Course Details
                        </Link>
                      </div>
                      <h4 className="text-xl font-semibold text-blue-800 mt-2">
                        {instance.course.title}
                      </h4>
                    </div>
                    
                    <p className="text-blue-700 leading-relaxed mb-4">
                      {instance.course.description}
                    </p>

                    {instance.course.prerequisites.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-blue-800 mb-2">Prerequisites:</h5>
                        <div className="flex flex-wrap gap-2">
                          {instance.course.prerequisites.map((prereq) => (
                            <Link
                              key={prereq}
                              to={`/courses/${prereq}`}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              {prereq}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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
              Delete Instance
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instance Summary</h3>
        <div className="prose max-w-none text-gray-600">
          <p>
            This course instance represents the delivery of{' '}
            <strong>{instance.course?.title || instance.courseId}</strong> scheduled for{' '}
            <strong>Semester {instance.semester} of {instance.year}</strong>.
          </p>
          {instance.course?.prerequisites.length > 0 && (
            <p>
              Students enrolling in this instance must have completed the prerequisite courses:{' '}
              <strong>{instance.course.prerequisites.join(', ')}</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstanceDetailPage;