import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Eye, AlertTriangle } from 'lucide-react';
import { Course } from '../../types/course';
import DeleteButton from '../UI/DeleteButton';

interface CourseCardProps {
  course: Course;
  onDelete: (courseId: string) => void;
  canDelete: boolean;
  deleteReason?: string;
  loading?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onDelete, 
  canDelete, 
  deleteReason,
  loading = false 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{course.id}</h3>
                <span className="text-xs text-gray-500 font-medium">Course ID</span>
              </div>
            </div>
            
            <h4 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
              {course.title}
            </h4>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
              {course.description}
            </p>
            
            {course.prerequisites.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">
                    Prerequisites ({course.prerequisites.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((prereq) => (
                    <Link
                      key={prereq}
                      to={`/courses/${prereq}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors border border-blue-200"
                    >
                      {prereq}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!canDelete && deleteReason && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    <span className="font-semibold">Deletion restricted:</span> {deleteReason}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
          
          <DeleteButton
            onDelete={() => onDelete(course.id)}
            canDelete={canDelete}
            loading={loading}
            reason={deleteReason}
            variant="button"
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;