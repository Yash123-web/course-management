import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Plus, Users, GraduationCap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to CourseHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage courses and course instances with ease. Create, organize, and track 
          course deliveries across different semesters and years.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/courses/create"
          className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Create New Course
              </h3>
              <p className="text-sm text-gray-600">
                Add a new course with prerequisites and detailed information
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/instances/create"
          className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Schedule Course Instance
              </h3>
              <p className="text-sm text-gray-600">
                Create a course delivery for a specific year and semester
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Feature Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What you can do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Courses</h3>
            <p className="text-sm text-gray-600">
              Create, view, and delete courses with comprehensive prerequisite management
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Instances</h3>
            <p className="text-sm text-gray-600">
              Plan course deliveries across different years and semesters
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Dependencies</h3>
            <p className="text-sm text-gray-600">
              Manage course prerequisites with automatic dependency validation
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/courses"
          className="group block p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all"
        >
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">View All Courses</h3>
              <p className="text-sm text-blue-700">Browse and manage existing courses</p>
            </div>
          </div>
        </Link>

        <Link
          to="/instances"
          className="group block p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:from-green-100 hover:to-green-200 transition-all"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">View All Instances</h3>
              <p className="text-sm text-green-700">Browse scheduled course deliveries</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;