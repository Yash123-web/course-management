import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center p-4 text-red-700 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;