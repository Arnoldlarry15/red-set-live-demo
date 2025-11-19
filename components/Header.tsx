import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-proto-dark border-b-2 border-proto-red p-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-4">
          <Logo className="h-12 w-12 text-proto-red" aria-label="Red Set Protocell Logo" />
          <h1 className="font-orbitron text-xl sm:text-2xl font-bold text-proto-light tracking-wider leading-tight">
              RED SET<br />PROTOCELL
          </h1>
      </div>
      <span className="text-sm font-bold bg-proto-gold text-proto-darker px-3 py-1 rounded-lg shadow-md">SIMULATED DEMO</span>
    </header>
  );
};

export default Header;