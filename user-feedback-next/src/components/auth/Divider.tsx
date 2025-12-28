import React from 'react';

export const Divider: React.FC = () => {
  return (
    <div className="relative w-full my-4 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-authBorder"></div>
      </div>
      <div className="relative bg-authBackground px-3 text-xs text-textMuted uppercase tracking-wider font-medium">
        Or
      </div>
    </div>
  );
};
