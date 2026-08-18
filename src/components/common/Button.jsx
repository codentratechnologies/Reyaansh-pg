import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary' | 'outline' | etc.
  className = '', 
  icon,
  onClick,
  type = 'button',
  ...props 
}) => {
  // Combine base class, variant class, and the advanced custom-btn class
  const baseClass = `btn-${variant}`;
  
  return (
    <button 
      type={type}
      className={`custom-btn ${baseClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
