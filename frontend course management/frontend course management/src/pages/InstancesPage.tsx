import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CourseInstance } from '../types/course';
import { instanceApi } from '../services/api';
import InstanceCard from '../components/Instance/InstanceCard';
import InstanceFilters from '../components/Instance/InstanceFilters';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import SuccessMessage from '../components/UI/SuccessMessage';

const InstancesPage: React.FC = () => {
  const [instances, setInstances] = useState<CourseInstance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<CourseInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Filter state
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const data = await instanceApi.getAllInstances();
      setInstances(data);
      setFilteredInstances(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch instances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleDelete = async (year: number, semester: number, courseId: string) => {
    const instanceKey = `${year}-${semester}-${courseId}`;
    
    if (!confirm(`Are you sure you want to delete this course instance?`)) {
      return;
    }

    try {
      setDeleteLoading(instanceKey);
      await instanceApi.deleteInstance(year, semester, courseId);
      setSuccess('Course instance deleted successfully');
      fetchInstances();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete instance');
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFilter = () => {
    let filtered = [...instances];

    if (filterYear) {
      filtered = filtered.filter(instance => instance.year.toString() === filterYear);
    }

    if (filterSemester) {
      filtered = filtered.filter(instance => instance.semester.toString() === filterSemester);
    }

    setFilteredInstances(filtered);
  };

  const handleClearFilters = () => {
    setFilterYear('');
    setFilterSemester('');
    setFilteredInstances(instances);
  };

  useEffect(() => {
    handleFilter();
  }, [filterYear, filterSemester, instances]);

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
          <h1 className="text-3xl font-bold text-gray-900">Course Instances</h1>
          <p className="text-gray-600 mt-1">Manage course deliveries and schedules</p>
        </div>
        <Link
          to="/instances/create"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Instance
        </Link>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Filters */}
      <InstanceFilters
        year={filterYear}
        semester={filterSemester}
        onYearChange={setFilterYear}
        onSemesterChange={setFilterSemester}
        onFilter={handleFilter}
        onClear={handleClearFilters}
      />

      {/* Instance List */}
      {filteredInstances.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {instances.length === 0 
              ? 'No course instances available.' 
              : 'No instances found matching the selected filters.'
            }
          </div>
          {instances.length === 0 && (
            <Link
              to="/instances/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first instance
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredInstances.map((instance) => (
            <InstanceCard
              key={`${instance.year}-${instance.semester}-${instance.courseId}`}
              instance={instance}
              onDelete={handleDelete}
              loading={deleteLoading === `${instance.year}-${instance.semester}-${instance.courseId}`}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{instances.length}</div>
            <div className="text-sm text-gray-600">Total Instances</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {new Set(instances.map(i => i.year)).size}
            </div>
            <div className="text-sm text-gray-600">Years</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(instances.map(i => i.courseId)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {instances.filter(i => i.year === new Date().getFullYear()).length}
            </div>
            <div className="text-sm text-gray-600">This Year</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstancesPage;