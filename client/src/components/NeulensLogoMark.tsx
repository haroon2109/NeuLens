import React from 'react';

export const NeulensLogoMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`relative block h-10 w-10 shrink-0 rounded-xl bg-white ${className}`} aria-hidden="true">
    <span className="absolute inset-x-0 top-0 h-8 overflow-hidden">
      <img
        src="/neulens-logo.png"
        alt=""
        className="absolute -left-3 -top-[7px] h-16 w-16 max-w-none"
      />
    </span>
  </span>
);

export default NeulensLogoMark;
