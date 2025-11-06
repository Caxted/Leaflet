
import React from 'react';

export type IconType = 'water' | 'sun' | 'feed' | 'prune';

interface IconProps {
  type: IconType;
  className?: string;
}

const ICONS: Record<IconType, React.ReactNode> = {
  water: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg>
  ),
  sun: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  feed: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 10.18a.5.5 0 0 0-.42-.18h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0-.5.5v2a.5.5 0 0 1 .5.5h2a.5.5 0 0 0 .5.5v2a.5.5 0 0 1 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1-.5-.5z"></path>
        <path d="m22 10-2-8-8-2-8 2-2 8"></path><path d="M12 10v12"></path>
    </svg>
  ),
  prune: (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.24 19.76 19.76 4.24"></path>
        <path d="m14.5 19.5 5-5"></path><path d="M14.5 9.5 18 6"></path>
        <path d="M9.5 4.5 6 8"></path>
        <path d="M4.5 14.5 9.5 9.5"></path>
        <path d="m15 21-3-3"></path>
        <path d="m9 15-3-3"></path>
        <circle cx="6.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  ),
};

export const Icon: React.FC<IconProps> = ({ type, className }) => {
  return <div className={className}>{ICONS[type]}</div>;
};
