import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
  className = ''
}) => {
  const variantStyles = {
    primary: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      border: 'border-blue-200/50',
      icon: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
      trend: trend?.isPositive ? 'text-emerald-600' : 'text-red-500',
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
      border: 'border-emerald-200/50',
      icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
      trend: trend?.isPositive ? 'text-emerald-600' : 'text-red-500',
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
      border: 'border-amber-200/50',
      icon: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
      trend: trend?.isPositive ? 'text-emerald-600' : 'text-red-500',
    },
    danger: {
      bg: 'bg-gradient-to-br from-red-50 to-pink-100',
      border: 'border-red-200/50',
      icon: 'bg-gradient-to-br from-red-500 to-pink-600 text-white',
      trend: trend?.isPositive ? 'text-emerald-600' : 'text-red-500',
    },
    info: {
      bg: 'bg-gradient-to-br from-slate-50 to-gray-100',
      border: 'border-slate-200/50',
      icon: 'bg-gradient-to-br from-slate-500 to-gray-600 text-white',
      trend: trend?.isPositive ? 'text-emerald-600' : 'text-red-500',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className={`
      group relative bg-white/70 backdrop-blur-sm rounded-2xl border ${currentVariant.border}
      shadow-sm hover:shadow-elegant transition-all duration-300 ease-in-out
      hover:-translate-y-1 hover:scale-[1.02] cursor-pointer animate-slide-up
      ${className}
    `}>
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 ${currentVariant.bg} rounded-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-300`} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
              {title}
            </p>
            <div className="mt-2">
              <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
              </p>
            </div>
          </div>
          
          {icon && (
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-xl ${currentVariant.icon}
              flex items-center justify-center shadow-md group-hover:shadow-lg
              transition-all duration-300 group-hover:scale-110
            `}>
              <div className="w-6 h-6">
                {icon}
              </div>
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-200/50">
            <div className={`flex items-center space-x-1 ${currentVariant.trend} font-medium text-sm`}>
              {trend.isPositive ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              )}
              <span>{trend.value}</span>
            </div>
            <span className="text-slate-500 text-sm">vs tháng trước</span>
          </div>
        )}

        {/* Floating Animation Dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 group-hover:opacity-40 animate-ping" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 group-hover:opacity-50 animate-pulse" />
      </div>
    </div>
  );
};