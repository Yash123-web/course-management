import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center p-4 text-green-700 bg-green-50 border border-green-200 rounded-md ${className}`}>
      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default SuccessMessage;