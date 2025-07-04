import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  href,
  target,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-visible-enhanced group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent text-background hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-1',
    secondary: 'border-2 border-primary/50 text-primary hover:bg-primary hover:text-background transform hover:-translate-y-1',
    ghost: 'text-text-primary hover:text-primary hover:bg-primary/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

  const iconElement = icon && (
    <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2'} transition-transform duration-300 ${
      variant === 'ghost' && iconPosition === 'right' ? 'group-hover:translate-x-1' : 'group-hover:scale-110'
    }`}>
      <i className={icon}></i>
    </span>
  );

  const loadingElement = loading && (
    <span className="ml-2">
      <i className="ri-loader-4-line animate-spin"></i>
    </span>
  );

  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      <span className="btn-text">{children}</span>
      {iconPosition === 'right' && iconElement}
      {loadingElement}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button; 