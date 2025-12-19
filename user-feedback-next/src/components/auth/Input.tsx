import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <div className="relative w-full">
      <input
        {...props}
        className={`
          peer w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
          text-textMain placeholder-transparent focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
          transition-all duration-200 text-[15px]
          ${props.className || ''}
        `}
        id={props.id || 'email-input'}
      />
      <label
        htmlFor={props.id || 'email-input'}
        className="
          absolute left-4 top-3.5 text-textMuted text-[15px]
          transition-all duration-200 pointer-events-none
          peer-placeholder-shown:text-[15px]
          peer-placeholder-shown:top-3.5
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-authBackground peer-focus:px-1 peer-focus:text-authPrimary
          peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-authBackground peer-not-placeholder-shown:px-1
        "
      >
        {props.placeholder}
      </label>
    </div>
  );
};
