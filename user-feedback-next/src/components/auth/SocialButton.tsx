import React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'github';
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, className, ...props }) => {
  const icon = provider === 'google' ? <GoogleIcon /> : <GithubIcon />;
  const label = provider === 'google' ? 'Continue with Google' : 'Continue with GitHub';

  return (
    <button
      type="button"
      {...props}
      className={`
        relative w-full bg-transparent border border-authBorder hover:bg-[#2A2B32]
        text-textMain font-medium rounded py-3.5 px-4
        transition-colors duration-200 flex items-center justify-start
        text-[15px] disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}
      `}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <span className="w-full text-center">{label}</span>
    </button>
  );
};
