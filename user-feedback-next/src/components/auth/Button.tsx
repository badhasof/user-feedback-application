import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`
        w-full bg-authPrimary hover:bg-authPrimaryHover text-white font-medium
        rounded py-3.5 px-4 transition-colors duration-200
        text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className || ''}
      `}
    >
      {children}
    </button>
  );
};
