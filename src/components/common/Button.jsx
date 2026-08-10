import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/utils';

/**
 * Modern Button Component with multiple variants and micro-interactions
 * Supports glassmorphism, gradients, and accessibility features
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  href,
  target,
  rel,
  type = 'button',
  ...props
}, ref) => {
  // Base button styles
  const baseStyles = `
    relative inline-flex items-center justify-center 
    font-medium transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    transform-gpu active:scale-[0.98] hover:scale-[1.02]
    select-none whitespace-nowrap
  `;

  // Size variants. Every size clears the 44px minimum touch target; the
  // smaller sizes differ in padding and type, not in tappable height.
  const sizeVariants = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md min-h-[44px]',
    sm: 'px-3 py-2 text-sm rounded-md min-h-[44px]',
    md: 'px-4 py-2.5 text-sm rounded-lg min-h-[44px]',
    lg: 'px-6 py-3 text-base rounded-lg min-h-[48px]',
    xl: 'px-8 py-4 text-lg rounded-xl min-h-[52px]'
  };

  // Button variants with modern design
  const variants = {
    // Primary - solid accent so it stays legible over the hero ambience
    primary: `
      bg-primary text-white border-0
      shadow-lg shadow-primary/25
      hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30
      focus:ring-primary
    `,

    // Secondary - Glass effect
    secondary: `
      bg-surface border border-border
      text-text-primary hover:text-primary
      hover:bg-surface-hover hover:border-border-hover
      focus:ring-primary
    `,

    // Outline - Modern outline with gradient border
    outline: `
      bg-transparent border-2 border-primary/30
      text-primary hover:text-white
      hover:bg-primary hover:border-primary
      focus:ring-primary
    `,

    // Ghost - Minimal hover effects
    ghost: `
      bg-transparent border-0 text-text-secondary
      hover:text-primary hover:bg-primary/10
      focus:ring-primary
    `,

    // Destructive - Red gradient
    destructive: `
      bg-gradient-to-r from-error-500 to-error-600
      text-white border-0 shadow-lg shadow-error-500/25
      hover:shadow-xl hover:shadow-error-500/30
      focus:ring-error-500
      before:absolute before:inset-0 before:rounded-[inherit]
      before:bg-gradient-to-r before:from-error-400 before:to-error-500
      before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-100
    `,

    // Success - Green gradient
    success: `
      bg-gradient-to-r from-success-500 to-success-600
      text-white border-0 shadow-lg shadow-success-500/25
      hover:shadow-xl hover:shadow-success-500/30
      focus:ring-success-500
      before:absolute before:inset-0 before:rounded-[inherit]
      before:bg-gradient-to-r before:from-success-400 before:to-success-500
      before:opacity-0 before:transition-opacity before:duration-200
      hover:before:opacity-100
    `,

    // Glass - Full glassmorphism effect
    glass: `
      bg-surface backdrop-blur-xl border border-border
      text-text-primary
      hover:bg-surface-hover hover:border-border-hover
      focus:ring-primary
    `,

    // Neon - Glowing effect
    neon: `
      bg-transparent border-2 border-accent
      text-accent shadow-lg shadow-accent/50
      hover:shadow-xl hover:shadow-accent/70
      hover:text-white hover:bg-accent
      focus:ring-primary
      relative overflow-hidden
    `
  };

  // Icon spacing
  const iconSpacing = {
    xs: 'space-x-1',
    sm: 'space-x-1.5',
    md: 'space-x-2',
    lg: 'space-x-2.5',
    xl: 'space-x-3'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Combine all classes
  const buttonClasses = cn(
    baseStyles,
    sizeVariants[size],
    variants[variant],
    iconSpacing[size],
    fullWidth && 'w-full',
    className
  );

  // If href is provided, render as link
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center">
          {leftIcon && !loading && (
            <span className="mr-2 flex-shrink-0">{leftIcon}</span>
          )}
          {loading && (
            <span className="mr-2 flex-shrink-0">
              <LoadingSpinner />
            </span>
          )}
          {children}
          {rightIcon && !loading && (
            <span className="ml-2 flex-shrink-0">{rightIcon}</span>
          )}
        </span>
      </a>
    );
  }

  // Render as button
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}
        {loading && (
          <span className="mr-2 flex-shrink-0">
            <LoadingSpinner />
          </span>
        )}
        {children}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'success',
    'glass',
    'neon'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
