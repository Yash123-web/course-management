import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Eye } from 'lucide-react';
import { CourseInstance } from '../../types/course';
import DeleteButton from '../UI/DeleteButton';

interface InstanceCardProps {
  instance: CourseInstance;
  onDelete: (year: number, semester: number, courseId: string) => void;
  loading?: boolean;
}

const InstanceCard: React.FC<InstanceCardProps> = ({ instance, onDelete, loading = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-200 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">
                  {instance.year} • Semester {instance.semester}
                </span>
                <div className="text-xs text-gray-500">Academic Period</div>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">{instance.courseId}</h3>
            </div>
            
            {instance.course && (
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-gray-900 leading-tight">
                  {instance.course.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {instance.course.description}
                </p>
                
                {instance.course.prerequisites.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-gray-500 mb-1 block">
                      Prerequisites Required:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {instance.course.prerequisites.map((prereq) => (
                        <span
                          key={prereq}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/instances/${instance.year}/${instance.semester}/${instance.courseId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
          
          <DeleteButton
            onDelete={() => onDelete(instance.year, instance.semester, instance.courseId)}
            canDelete={true}
            loading={loading}
            variant="button"
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default InstanceCard;