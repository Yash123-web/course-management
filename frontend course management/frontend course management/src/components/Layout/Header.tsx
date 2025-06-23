import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span>CourseHub</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/courses"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/courses')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Link>
              <Link
                to="/instances"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive('/instances')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Instances
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/courses/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Link>
            <Link
              to="/instances/create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Instance
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;