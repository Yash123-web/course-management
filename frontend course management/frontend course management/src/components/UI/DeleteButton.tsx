import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface DeleteButtonProps {
  onDelete: () => void;
  canDelete: boolean;
  loading?: boolean;
  reason?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  canDelete,
  loading = false,
  reason,
  size = 'md',
  variant = 'button',
  className = ''
}) => {
  const sizeClasses = {
    sm: variant === 'icon' ? 'p-1' : 'px-2 py-1 text-xs',
    md: variant === 'icon' ? 'p-2' : 'px-3 py-2 text-sm',
    lg: variant === 'icon' ? 'p-3' : 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const baseClasses = `inline-flex items-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeClasses[size]}`;

  if (!canDelete) {
    return (
      <div className="relative group">
        <button
          disabled
          className={`${baseClasses} text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed ${className}`}
          title={reason || 'Cannot delete due to dependencies'}
        >
          {loading ? (
            <LoadingSpinner size="sm" className={variant === 'button' ? 'mr-2' : ''} />
          ) : (
            <AlertTriangle className={`${iconSizes[size]} ${variant === 'button' ? 'mr-2' : ''}`} />
          )}
          {variant === 'button' && 'Cannot Delete'}
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {reason || 'Cannot delete due to dependencies'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className={`${baseClasses} text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Delete"
    >
      {loading ? (
        <LoadingSpinner size="sm" className={variant === 'button' ? 'mr-2' : ''} />
      ) : (
        <Trash2 className={`${iconSizes[size]} ${variant === 'button' ? 'mr-2' : ''}`} />
      )}
      {variant === 'button' && 'Delete'}
    </button>
  );
};

export default DeleteButton;